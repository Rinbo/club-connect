import NodeCache from 'node-cache';

let cache: NodeCache;

declare global {
  var cache: NodeCache | undefined;
}

if (process.env.NODE_ENV === 'production') {
  cache = new NodeCache();
} else {
  if (!global.cache) {
    global.cache = new NodeCache();
  }
  cache = global.cache;
}

export { cache };
