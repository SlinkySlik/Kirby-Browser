(function() {
  let initialized = false;
  const origCreateGain = AudioContext.prototype.createGain;
  AudioContext.prototype.createGain = function() {
    const gain = origCreateGain.apply(this, arguments);
    try {
      const Module = window.EJS_emulator.Module;
      if (!initialized) {
        if (window.AL || Module.AL) { // AL system present, no need to spoof
          AudioContext.prototype.createGain = origCreateGain;
          return gain;
        }
        window.AL = Module.AL = { currentCtx: { sources: [] } };
        initialized = true;
      }
      Module.AL.currentCtx.sources.push({ gain });
    } catch (e) {
      console.error('Failed to spoof AL system', e);
    }
    return gain;
  };
})();
