'use strict';

var benchmark = require('vdom-benchmark-base');
var Shapedom = require('shapedom');

var NAME = 'Shapedom';
var VERSION = '0.1.2';

var shapedom;

function renderTree(nodes) {
  var children = [];
  var i;
  var n;
  var shape;

  for (i = 0; i < nodes.length; i++) {
    n = nodes[i];
    if (n.children !== null) {
      shape = {
        tag: 'div',
        attrs: {},
        children: renderTree(n.children)
      };
    } else {
      shape = {
        tag: 'span',
        attrs: {},
        children: [
          {
            text: n.key.toString()
          }
        ]
      };
    }
    children.push(shape);
  }

  return children;
}

function BenchmarkImpl(container, a, b) {
  this.container = container;
  this.a = a;
  this.b = b;
  this._vRoot = null;
  this._root = null;
}

BenchmarkImpl.prototype.setUp = function() {
  shapedom = new Shapedom(document);
};

BenchmarkImpl.prototype.tearDown = function() {
  this.container.removeChild(this._root);
};

BenchmarkImpl.prototype.render = function() {
  this._vRoot = shapedom.createTemplate({
    tag: 'div',
    attrs: {},
    children: renderTree(this.a)
  });
  this._root = shapedom.render(this._vRoot);
  this.container.appendChild(this._root);
};

BenchmarkImpl.prototype.update = function() {
  var newVroot = shapedom.createTemplate({
    tag: 'div',
    attrs: {},
    children: renderTree(this.b)
  });
  shapedom.update(this._root, newVroot);
};

document.addEventListener('DOMContentLoaded', function(e) {
  benchmark(NAME, VERSION, BenchmarkImpl);
}, false);
