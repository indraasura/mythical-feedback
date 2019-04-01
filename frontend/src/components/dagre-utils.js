const __assign = (this && this.__assign) || Object.assign || function(t) {
    for (let s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (let p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const dagre = require("dagre");
const _ = require("lodash");
const size = {
    width: 60,
    height: 60
};
function distributeElements(model) {
    const clonedModel = _.cloneDeep(model);
    const nodes = distributeGraph(clonedModel);
    nodes.forEach(function (node) {
        const modelNode = clonedModel.nodes.find(function (item) { return item.id === node.id; });
        modelNode.x = (node.x - node.width / 2) + 450;
        modelNode.y = (node.y - node.height / 2) + 100;
    });
    return clonedModel;
}
exports.distributeElements = distributeElements;
function distributeGraph(model) {
    const nodes = mapElements(model);
    const edges = mapEdges(model);
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({});
    graph.setDefaultEdgeLabel(function () { return ({}); });
    //add elements to dagre graph
    nodes.forEach(function (node) {
        graph.setNode(node.id, node.metadata);
    });
    edges.forEach(function (edge) {
        if (edge.from && edge.to) {
            graph.setEdge(edge.from, edge.to);
        }
    });
    //auto-distribute
    dagre.layout(graph);
    return graph.nodes().map(function (node) { return graph.node(node); });
}
function mapElements(model) {
    // dagre compatible format
    return model.nodes.map(function (node) { return ({ id: node.id, metadata: __assign({}, size, { id: node.id }) }); });
}
function mapEdges(model) {
    // returns links which connects nodes
    // we check are there both from and to nodes in the model. Sometimes links can be detached
    return model.links
        .map(function (link) { return ({
            from: link.source,
            to: link.target
        }); })
        .filter(function (item) { return model.nodes.find(function (node) { return node.id === item.from; }) && model.nodes.find(function (node) { return node.id === item.to; }); });
}
