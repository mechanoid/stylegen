"use strict";

import * as path from 'path';
import {Styleguide} from './Styleguide';
import {Node, INodeOptions} from './Node';
import {ComponentList} from './ComponentList';

/**
 * The StructureReader class serves as orchestrator to our styleguide class,
 * so that we can chain up the necessary steps which fill our styleguide structure appropriatly.
 */
export class StructureReader {
  styleguide:Styleguide;

  constructor(styleguide:Styleguide) {
    /** lets hold a reference to the parent styleguide */
    this.styleguide = styleguide;
  }

  /**
   * because all the configured folders and files in the styleguide configuration,
   * are realtive to the current working directory of the user, we need a little helper,
   * to look at the right place.
   */
  private fileInCWD(p:string):string {
    return path.resolve(this.styleguide.config["cwd"], p);
  }

  private buildComponentDictionary(nodes: Node[], dict: ComponentList) {
    for (let node of nodes) {
      if (node.isComponent()) {
        dict.set(node.component.id, node.component);
      }

      if (!!node.children) {
        this.buildComponentDictionary(node.children, dict);
      }
    }
  }

  /**
   * Collect all the little things, that represent out styleguide, e.g. components and pages
   */
  public collect():Promise<StructureReader> {
    var componentPaths:string[] = this.styleguide.config["componentPaths"];

    /**
     * a node is a sub entry in our component hierarchy, which may be a component or
     * just a category folder (or maybe just empty :/)
     */
    var nodeLookups = componentPaths.map((p) => {
      var nodeConfig:INodeOptions = {
        styleguide: this.styleguide
      };

      if (!!this.styleguide.config.namespace) {
        nodeConfig.namespace = this.styleguide.config.namespace;
      }

      if (!!this.styleguide.config.componentDocs) {
        nodeConfig.componentDocs = this.styleguide.config.componentDocs;
      }

      return new Node(this.fileInCWD(p), null, nodeConfig).resolve();
    });

    /**
     * Take all the root nodes and look forward to collect components and similar.
     */
    return Promise.all(nodeLookups)
    .then((nodes) => {
      /** assign nodes to the parent styleguide */
      this.styleguide.nodes = nodes;
      this.buildComponentDictionary(nodes, this.styleguide.components);
      return this;
    });
  }
};
