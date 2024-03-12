import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { REGISTRY_PORT } from "../config";
import { generateKeyPairSync, privateEncrypt, publicDecrypt } from "crypto";

export type Node = { nodeId: number; pubKey: string};

export type RegisterNodeBody = {
  nodeId: number;
  pubKey: string;
};

export type GetNodeRegistryBody = {
  nodes: Node[];
};

const nodesRegistry: Node[] = [];

export async function launchRegistry() {
  const _registry = express();
  _registry.use(express.json());
  _registry.use(bodyParser.json());

  var nodes = new Array<Node>();

  // TODO implement the status route
  // _registry.get("/status", (req, res) => {});
  _registry.get("/status", (req, res) => {
      res.send("live");
    });

  let NodeRegistryBody: GetNodeRegistryBody = { nodes: [] };

  _registry.post("/registerNode", (req, res) => {
    const { nodeId, pubKey } = req.body;
    if (NodeRegistryBody.nodes.some(n => n.nodeId === nodeId || n.pubKey === pubKey)) {
      return res.send("Node already registered or public key in use.");
    }else{
      NodeRegistryBody.nodes.push({ nodeId, pubKey });
      return res.send("Node registered successfully.");
    }
  });

  _registry.get("/getNodeRegistry", (req, res) => {
    res.json(NodeRegistryBody);
  });
  

  const server = _registry.listen(REGISTRY_PORT, () => {
    console.log(`registry is listening on port ${REGISTRY_PORT}`);
  });

  return server;
}