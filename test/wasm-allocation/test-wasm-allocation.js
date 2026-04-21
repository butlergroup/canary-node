// Flags: --disable-wasm-trap-handler
// Test that with limited virtual memory space, --disable-wasm-trap-handler
// allows WASM to at least run with inline bound checks.
'use strict';

const common = require('../common');
const assert = require('assert');
const { isMainThread } = require('worker_threads');

// The first allocation should succeed.
const first = new WebAssembly.Memory({ initial: 10, maximum: 100 });
assert(first);

if (!isMainThread) {
  // https://github.com/nodejs/node/issues/62870
  common.skip('Workers terminate instead of throwing');
}

// Subsequent allocations should eventually fail due to running out of
// virtual address space.
assert.throws(() => {
  const instances = [first];
  for (let i = 1; i < 30; i++) {
    instances.push(new WebAssembly.Memory({ initial: 10, maximum: 100 }));
  }
}, /WebAssembly\.Memory/);
