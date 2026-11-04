/*
 * <byte-mascot> — Byte, the Binary Brains mascot, as an animated web component.
 *
 *   <script src="byte-mascot.js"></script>
 *   <byte-mascot state="idle" style="width:360px"></byte-mascot>
 *
 *   const byte = document.querySelector('byte-mascot');
 *   byte.state = 'laptop';                // looping mode: idle | music | laptop | sleep
 *   byte.react('celebrate');              // one-shot reaction (queued, returns a Promise)
 *   byte.react('cheer', { say: '+50' });  // reaction with a speech bubble
 *   byte.say('HI!');                      // speech bubble on its own
 *   byte.lookAt(element);                 // glance at something on the page
 *   byte.attract = true;                  // autopilot for when the screen is idle
 *
 * Reactions: celebrate cheer shock sad dizzy love wave dance hype spin glitch think yawn wake
 * The ART block (art + animation pivots) is generated from byte-design.json by build.mjs.
 * Change Byte's proportions and colours in designer.html, which saves and rebuilds it.
 */
(() => {
  const ART = /*ART*/{"markup":"<defs><radialGradient id=\"byte-glow\"><stop offset=\"0\" stop-color=\"#A6FFC4\" stop-opacity=\".3\"/><stop offset=\"1\" stop-color=\"#A6FFC4\" stop-opacity=\"0\"/></radialGradient></defs><g class=\"fx fx-flames\" display=\"none\"><g transform=\"translate(10 5)\"><g class=\"fxi flame\" style=\"--s:1.5;animation-delay:0s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g><g transform=\"translate(300 5)\"><g class=\"fxi flame\" style=\"--s:1.5;animation-delay:-0.15s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g><g transform=\"translate(155 60)\"><g class=\"fxi flame\" style=\"--s:1.3;animation-delay:-0.08s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g><g transform=\"translate(-50 140)\"><g class=\"fxi flame\" style=\"--s:1.8;animation-delay:-0.2s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g><g transform=\"translate(360 140)\"><g class=\"fxi flame\" style=\"--s:1.8;animation-delay:-0.05s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g><g transform=\"translate(-40 269)\"><g class=\"fxi flame\" style=\"--s:1.6;animation-delay:-0.12s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g><g transform=\"translate(350 269)\"><g class=\"fxi flame\" style=\"--s:1.6;animation-delay:-0.25s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM10 10h40v10h-40zM0 20h50v20h-50zM-10 40h70v20h-70zM0 60h50v10h-50zM10 70h30v10h-30z\"/><path fill=\"#FF7A1A\" d=\"M20 0h10v10h-10zM20 10h20v10h-20zM10 20h30v10h-30zM10 30h10v10h-10zM30 30h10v10h-10zM0 40h20v10h-20zM30 40h20v10h-20zM0 50h10v10h-10zM40 50h10v10h-10zM10 60h10v10h-10zM30 60h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 30h10v20h-10zM10 50h30v10h-30zM20 60h10v10h-10z\"/></g></g></g><ellipse class=\"shadow\" cx=\"180\" cy=\"393\" rx=\"125\" ry=\"9\" fill=\"#000\" opacity=\".28\"/><g class=\"rig\"><g class=\"squash\"><g class=\"tilt\"><g class=\"band\"><path fill=\"#031B0E\" d=\"M120 80h120v10h-120zM90 90h180v10h-180zM80 100h200v10h-200zM60 110h60v10h-60zM240 110h60v10h-60zM50 120h40v10h-40zM270 120h40v10h-40zM40 130h40v10h-40zM280 130h40v10h-40zM30 140h30v20h-30zM300 140h30v20h-30zM40 160h10v10h-10zM310 160h10v10h-10z\"/><path fill=\"#465851\" d=\"M120 90h120v10h-120zM90 100h30v10h-30zM240 100h30v10h-30zM80 110h10v10h-10zM270 110h10v10h-10zM60 120h20v10h-20zM280 120h20v10h-20zM50 130h10v10h-10zM300 130h10v10h-10zM40 140h10v20h-10zM310 140h10v20h-10z\"/><path class=\"led\" fill=\"#A6FFC4\" d=\"M160 90h40v10h-40z\"/></g><g class=\"outlines\"><path class=\"p-hornL\" fill=\"#031B0E\" d=\"M30 50h60v10h-60zM20 60h80v40h-80zM30 100h80v10h-80zM30 110h90v10h-90zM40 120h90v10h-90zM50 130h80v10h-80zM50 140h90v10h-90zM60 150h90v20h-90zM60 170h80v10h-80zM70 180h60v10h-60z\"/><path class=\"p-hornR\" fill=\"#031B0E\" d=\"M270 50h60v10h-60zM260 60h80v40h-80zM250 100h80v10h-80zM240 110h90v10h-90zM230 120h90v10h-90zM230 130h80v10h-80zM220 140h90v10h-90zM210 150h90v20h-90zM220 170h80v10h-80zM230 180h60v10h-60z\"/><path class=\"p-legL\" fill=\"#031B0E\" d=\"M90 280h50v10h-50zM80 290h70v90h-70zM90 380h50v10h-50z\"/><path class=\"p-legR\" fill=\"#031B0E\" d=\"M220 280h50v10h-50zM210 290h70v90h-70zM220 380h50v10h-50z\"/><path class=\"p-armL\" transform=\"translate(70 0)\" fill=\"#031B0E\" d=\"M0 260h100v10h-100zM-10 270h120v10h-120zM-20 280h130v10h-130zM-10 290h120v10h-120zM0 300h100v10h-100z\"/><path class=\"p-armR\" transform=\"translate(-70 0)\" fill=\"#031B0E\" d=\"M260 260h100v10h-100zM250 270h120v10h-120zM250 280h130v10h-130zM250 290h120v10h-120zM260 300h100v10h-100z\"/><path class=\"p-body\" fill=\"#031B0E\" d=\"M60 150h240v10h-240zM50 160h260v10h-260zM40 170h280v120h-280zM30 290h300v10h-300zM20 300h320v30h-320zM140 330h80v10h-80zM20 330h60v30h-60zM280 330h60v30h-60zM30 360h40v10h-40zM290 360h40v10h-40z\"/></g><g class=\"fills\"><g class=\"p-hornL\"><path fill=\"#56B776\" d=\"M30 60h60v40h-60zM40 100h60v10h-60zM40 110h70v10h-70zM50 120h70v10h-70zM60 130h60v10h-60zM60 140h70v10h-70zM70 150h70v20h-70zM70 170h60v10h-60z\"/><path fill=\"#8CE2A8\" d=\"M30 60h60v10h-60zM30 70h10v20h-10zM40 100h10v10h-10zM90 100h10v10h-10zM100 110h10v10h-10zM110 120h10v10h-10zM60 130h10v10h-10zM120 140h10v10h-10zM70 150h10v10h-10zM130 150h10v10h-10z\"/><path fill=\"#379356\" d=\"M80 70h10v30h-10zM30 90h10v10h-10zM40 110h10v10h-10zM50 120h10v10h-10zM110 130h10v10h-10zM60 140h10v10h-10z\"/></g><g class=\"p-hornR\"><path fill=\"#56B776\" d=\"M270 60h60v40h-60zM260 100h60v10h-60zM250 110h70v10h-70zM240 120h70v10h-70zM240 130h60v10h-60zM230 140h70v10h-70zM220 150h70v20h-70zM230 170h60v10h-60z\"/><path fill=\"#8CE2A8\" d=\"M270 60h60v10h-60zM270 70h10v30h-10zM260 100h10v10h-10zM250 110h10v10h-10zM240 120h10v20h-10zM230 140h10v10h-10zM220 150h10v10h-10z\"/><path fill=\"#379356\" d=\"M320 70h10v30h-10zM310 100h10v20h-10zM300 120h10v10h-10zM290 130h10v20h-10zM280 150h10v10h-10z\"/></g><g class=\"p-legL\"><path fill=\"#56B776\" d=\"M90 290h50v90h-50z\"/><path fill=\"#8CE2A8\" d=\"M90 320h10v50h-10z\"/><path fill=\"#379356\" d=\"M130 330h10v40h-10zM90 370h50v10h-50z\"/></g><g class=\"p-legR\"><path fill=\"#56B776\" d=\"M220 290h50v90h-50z\"/><path fill=\"#8CE2A8\" d=\"M220 330h10v40h-10z\"/><path fill=\"#379356\" d=\"M260 320h10v50h-10zM220 370h50v10h-50z\"/></g><g class=\"p-armL\" transform=\"translate(70 0)\"><path fill=\"#56B776\" d=\"M0 270h100v10h-100zM-10 280h110v10h-110zM0 290h100v10h-100z\"/><path fill=\"#8CE2A8\" d=\"M0 270h50v10h-50z\"/><path fill=\"#379356\" d=\"M-10 280h10v10h-10zM0 290h30v10h-30z\"/></g><g class=\"p-armR\" transform=\"translate(-70 0)\"><path fill=\"#56B776\" d=\"M260 270h100v10h-100zM260 280h110v10h-110zM260 290h100v10h-100z\"/><path fill=\"#8CE2A8\" d=\"M310 270h50v10h-50z\"/><path fill=\"#379356\" d=\"M360 280h10v10h-10zM330 290h30v10h-30z\"/></g><g class=\"p-body\"><path fill=\"#56B776\" d=\"M60 160h240v10h-240zM50 170h260v130h-260zM30 300h300v20h-300zM140 320h80v10h-80zM30 320h40v40h-40zM290 320h40v40h-40z\"/><path fill=\"#8CE2A8\" d=\"M60 160h10v10h-10zM140 160h80v10h-80zM290 160h10v10h-10zM300 170h10v10h-10zM50 170h10v100h-10zM30 300h10v50h-10zM290 320h10v30h-10z\"/><path fill=\"#379356\" d=\"M300 180h10v90h-10zM70 310h20v10h-20zM270 310h20v10h-20zM140 320h80v10h-80zM320 300h10v50h-10zM60 320h10v30h-10zM30 350h40v10h-40zM290 350h40v10h-40z\"/></g></g><g class=\"face\"><g class=\"look\"><g class=\"eye eyeL\"><g class=\"blinker\"><g class=\"ev ev-normal\"><path fill=\"#031B0E\" d=\"M90 210h40v10h-40zM110 220h30v10h-30zM80 220h10v20h-10zM100 230h40v10h-40zM80 240h60v30h-60zM90 270h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M90 220h20v10h-20zM90 230h10v10h-10z\"/></g><g class=\"ev ev-happy\" display=\"none\"><path fill=\"#031B0E\" d=\"M90 220h40v10h-40zM80 230h20v10h-20zM120 230h20v10h-20zM80 240h10v10h-10zM130 240h10v10h-10z\"/></g><g class=\"ev ev-closed\" display=\"none\"><path fill=\"#031B0E\" d=\"M80 240h10v10h-10zM130 240h10v10h-10zM80 250h20v10h-20zM120 250h20v10h-20zM90 260h40v10h-40z\"/></g><g class=\"ev ev-sad\" display=\"none\"><path fill=\"#031B0E\" d=\"M110 220h30v10h-30zM90 230h50v10h-50zM110 240h30v10h-30zM80 240h10v20h-10zM100 250h40v10h-40zM80 260h60v10h-60zM90 270h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M90 240h20v10h-20zM90 250h10v10h-10z\"/></g><g class=\"ev ev-angry\" display=\"none\"><path fill=\"#031B0E\" d=\"M80 220h30v10h-30zM80 230h50v10h-50zM80 240h10v10h-10zM110 240h30v10h-30zM80 250h60v20h-60zM90 270h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M90 240h20v10h-20z\"/></g><g class=\"ev ev-spiral\" display=\"none\"><g class=\"spin\"><path fill=\"#031B0E\" d=\"M80 210h60v10h-60zM90 230h30v10h-30zM110 240h10v10h-10zM130 220h10v40h-10zM90 240h10v20h-10zM90 260h50v10h-50z\"/></g></g><g class=\"ev ev-star\" display=\"none\"><path fill=\"#031B0E\" d=\"M100 200h20v10h-20zM90 210h40v10h-40zM80 220h60v10h-60zM70 230h80v10h-80zM80 240h60v20h-60zM70 260h80v10h-80zM80 270h20v10h-20zM120 270h20v10h-20z\"/><path fill=\"#FFD447\" d=\"M100 210h20v20h-20zM80 230h60v10h-60zM90 240h40v20h-40zM80 260h20v10h-20zM120 260h20v10h-20z\"/></g><g class=\"ev ev-heart\" display=\"none\"><g transform=\"translate(-5 0)\"><path fill=\"#031B0E\" d=\"M90 210h20v10h-20zM120 210h20v10h-20zM80 220h70v10h-70zM70 230h90v20h-90zM80 250h70v10h-70zM90 260h50v10h-50zM100 270h30v10h-30zM110 280h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M90 220h20v10h-20zM120 220h20v10h-20zM80 230h10v10h-10zM100 230h50v10h-50zM80 240h70v10h-70zM90 250h50v10h-50zM100 260h30v10h-30zM110 270h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M90 230h10v10h-10z\"/></g></g></g></g><g class=\"eye eyeR\"><g class=\"blinker\"><g class=\"ev ev-normal\"><path fill=\"#031B0E\" d=\"M230 210h40v10h-40zM220 220h60v50h-60zM230 270h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M230 220h20v10h-20zM230 230h10v10h-10z\"/></g><g class=\"ev ev-happy\" display=\"none\"><path fill=\"#031B0E\" d=\"M230 220h40v10h-40zM220 230h20v10h-20zM260 230h20v10h-20zM220 240h10v10h-10zM270 240h10v10h-10z\"/></g><g class=\"ev ev-closed\" display=\"none\"><path fill=\"#031B0E\" d=\"M220 240h10v10h-10zM270 240h10v10h-10zM220 250h20v10h-20zM260 250h20v10h-20zM230 260h40v10h-40z\"/></g><g class=\"ev ev-sad\" display=\"none\"><path fill=\"#031B0E\" d=\"M220 220h30v10h-30zM220 230h50v10h-50zM220 240h60v30h-60zM230 270h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M230 240h20v10h-20zM230 250h10v10h-10z\"/></g><g class=\"ev ev-angry\" display=\"none\"><path fill=\"#031B0E\" d=\"M250 220h30v10h-30zM230 230h50v10h-50zM220 240h60v30h-60zM230 270h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M230 240h20v10h-20z\"/></g><g class=\"ev ev-spiral\" display=\"none\"><g class=\"spin\"><path fill=\"#031B0E\" d=\"M220 210h60v10h-60zM240 230h30v10h-30zM240 240h10v10h-10zM220 220h10v40h-10zM260 240h10v20h-10zM220 260h50v10h-50z\"/></g></g><g class=\"ev ev-star\" display=\"none\"><path fill=\"#031B0E\" d=\"M240 200h20v10h-20zM230 210h40v10h-40zM220 220h60v10h-60zM210 230h80v10h-80zM220 240h60v20h-60zM210 260h80v10h-80zM220 270h20v10h-20zM260 270h20v10h-20z\"/><path fill=\"#FFD447\" d=\"M240 210h20v20h-20zM220 230h60v10h-60zM230 240h40v20h-40zM220 260h20v10h-20zM260 260h20v10h-20z\"/></g><g class=\"ev ev-heart\" display=\"none\"><g transform=\"translate(5 0)\"><path fill=\"#031B0E\" d=\"M220 210h20v10h-20zM250 210h20v10h-20zM210 220h70v10h-70zM200 230h90v20h-90zM210 250h70v10h-70zM220 260h50v10h-50zM230 270h30v10h-30zM240 280h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M220 220h20v10h-20zM250 220h20v10h-20zM210 230h70v20h-70zM220 250h50v10h-50zM230 260h30v10h-30zM240 270h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M220 230h10v10h-10z\"/></g></g></g></g></g><g class=\"mlook\"><g class=\"mv mv-smile\"><path fill=\"#031B0E\" d=\"M150 280h60v10h-60zM150 290h10v10h-10zM200 290h10v10h-10zM160 300h40v10h-40z\"/><path fill=\"#1D6B37\" d=\"M160 290h40v10h-40z\"/></g><g class=\"mv mv-grin\" display=\"none\"><path fill=\"#031B0E\" d=\"M140 280h80v10h-80zM140 290h10v20h-10zM210 290h10v20h-10zM150 310h10v10h-10zM200 310h10v10h-10zM160 320h40v10h-40z\"/><path fill=\"#1D6B37\" d=\"M150 290h60v10h-60zM150 300h20v10h-20zM190 300h20v10h-20z\"/><path fill=\"#FF7F9C\" d=\"M170 300h20v10h-20zM160 310h40v10h-40z\"/></g><g class=\"mv mv-o\" display=\"none\"><path fill=\"#031B0E\" d=\"M160 280h40v10h-40zM150 290h10v20h-10zM200 290h10v20h-10zM160 310h40v10h-40z\"/><path fill=\"#1D6B37\" d=\"M160 290h40v20h-40z\"/></g><g class=\"mv mv-small\" display=\"none\"><path fill=\"#031B0E\" d=\"M170 290h20v10h-20zM160 300h10v10h-10zM190 300h10v10h-10zM170 310h20v10h-20z\"/><path fill=\"#1D6B37\" d=\"M170 300h20v10h-20z\"/></g><g class=\"mv mv-flat\" display=\"none\"><path fill=\"#031B0E\" d=\"M160 290h40v10h-40z\"/></g><g class=\"mv mv-frown\" display=\"none\"><path fill=\"#031B0E\" d=\"M160 290h40v10h-40zM150 300h10v10h-10zM200 300h10v10h-10z\"/></g><g class=\"mv mv-wavy\" display=\"none\"><path fill=\"#031B0E\" d=\"M160 290h10v10h-10zM190 290h10v10h-10zM150 300h10v10h-10zM170 300h20v10h-20zM200 300h10v10h-10z\"/></g></g><g class=\"blush\" display=\"none\"><path fill=\"#FF8FAB\" d=\"M60 280h30v20h-30zM270 280h30v20h-30z\"/></g></g><g class=\"cups\"><g class=\"cupL\"><path fill=\"#031B0E\" d=\"M30 150h30v10h-30zM20 160h50v10h-50zM10 170h60v60h-60zM20 230h50v10h-50zM30 240h30v10h-30z\"/><path fill=\"#26302C\" d=\"M30 160h30v10h-30zM20 170h40v60h-40zM30 230h30v10h-30z\"/><path fill=\"#465851\" d=\"M30 160h30v10h-30zM30 170h10v60h-10z\"/><path class=\"led\" fill=\"#A6FFC4\" d=\"M20 170h10v60h-10z\"/></g><g class=\"cupR\"><path fill=\"#031B0E\" d=\"M300 150h30v10h-30zM290 160h50v10h-50zM290 170h60v60h-60zM290 230h50v10h-50zM300 240h30v10h-30z\"/><path fill=\"#26302C\" d=\"M300 160h30v10h-30zM300 170h40v60h-40zM300 230h30v10h-30z\"/><path fill=\"#465851\" d=\"M300 160h30v10h-30zM320 170h10v60h-10z\"/><path class=\"led\" fill=\"#A6FFC4\" d=\"M330 170h10v60h-10z\"/></g></g></g></g></g><g class=\"laptop\"><ellipse class=\"screen-glow\" cx=\"180\" cy=\"338\" rx=\"140\" ry=\"48\" fill=\"url(#byte-glow)\"/><g class=\"mitts\"><g class=\"mitt mittL\"><path fill=\"#031B0E\" d=\"M60 280h30v10h-30zM50 290h50v50h-50zM60 340h30v10h-30z\"/><path fill=\"#56B776\" d=\"M60 290h30v50h-30z\"/><path fill=\"#8CE2A8\" d=\"M60 290h30v10h-30z\"/></g><g class=\"mitt mittR\"><path fill=\"#031B0E\" d=\"M270 280h30v10h-30zM260 290h50v50h-50zM270 340h30v10h-30z\"/><path fill=\"#56B776\" d=\"M270 290h30v50h-30z\"/><path fill=\"#8CE2A8\" d=\"M270 290h30v10h-30z\"/></g></g><g class=\"glyphs\"><g transform=\"translate(90 290)\"><g class=\"fxi glyph\" style=\"--dx:-130px;animation-delay:0s\"><path fill=\"#031B0E\" d=\"M0 -10h30v10h-30zM-10 0h50v50h-50zM0 50h30v10h-30z\"/><path fill=\"#A6FFC4\" d=\"M0 0h30v10h-30zM0 10h10v30h-10zM20 10h10v30h-10zM0 40h30v10h-30z\"/></g></g><g transform=\"translate(125 290)\"><g class=\"fxi glyph\" style=\"--dx:-90px;animation-delay:-0.65s\"><path fill=\"#031B0E\" d=\"M10 -10h10v10h-10zM0 0h30v10h-30zM-10 10h40v10h-40zM0 20h30v20h-30zM-10 40h50v10h-50zM0 50h30v10h-30z\"/><path fill=\"#A6FFC4\" d=\"M10 0h10v10h-10zM0 10h20v10h-20zM10 20h10v20h-10zM0 40h30v10h-30z\"/></g></g><g transform=\"translate(205 290)\"><g class=\"fxi glyph\" style=\"--dx:90px;animation-delay:-1.3s\"><path fill=\"#031B0E\" d=\"M10 -10h10v10h-10zM0 0h30v10h-30zM-10 10h40v10h-40zM0 20h30v20h-30zM-10 40h50v10h-50zM0 50h30v10h-30z\"/><path fill=\"#A6FFC4\" d=\"M10 0h10v10h-10zM0 10h20v10h-20zM10 20h10v20h-10zM0 40h30v10h-30z\"/></g></g><g transform=\"translate(240 290)\"><g class=\"fxi glyph\" style=\"--dx:130px;animation-delay:-1.95s\"><path fill=\"#031B0E\" d=\"M0 -10h30v10h-30zM-10 0h50v50h-50zM0 50h30v10h-30z\"/><path fill=\"#A6FFC4\" d=\"M0 0h30v10h-30zM0 10h10v30h-10zM20 10h10v30h-10zM0 40h30v10h-30z\"/></g></g></g><path fill=\"#031B0E\" d=\"M70 310h220v10h-220zM60 320h240v50h-240zM40 370h280v10h-280zM30 380h300v10h-300zM40 390h280v10h-280z\"/><path fill=\"#5E7068\" d=\"M70 320h220v60h-220z\"/><path fill=\"#7D918A\" d=\"M70 320h220v10h-220z\"/><path fill=\"#26302C\" d=\"M40 380h280v10h-280z\"/><path fill=\"#031B0E\" d=\"M170 330h20v10h-20zM160 340h40v10h-40zM150 350h60v20h-60zM160 370h40v20h-40zM170 390h20v10h-20z\"/><path class=\"bulb\" fill=\"#A6FFC4\" d=\"M170 340h20v10h-20zM160 350h40v20h-40zM170 370h20v10h-20z\"/><path fill=\"#26302C\" d=\"M170 380h20v10h-20z\"/></g><g class=\"fx fx-notes\" display=\"none\"><g transform=\"translate(-40 140)\"><g class=\"fxi note\" style=\"--dx:-50px;--r:-20deg;animation-delay:0s\"><path fill=\"#031B0E\" d=\"M10 -10h50v10h-50zM0 0h70v20h-70zM0 20h30v10h-30zM40 20h30v10h-30zM-10 30h80v20h-80zM0 50h20v10h-20zM40 50h20v10h-20z\"/><path fill=\"#A6FFC4\" d=\"M10 0h50v10h-50zM10 10h10v20h-10zM50 10h10v20h-10zM0 30h20v20h-20zM40 30h20v20h-20z\"/></g></g><g transform=\"translate(340 130)\"><g class=\"fxi note\" style=\"--dx:50px;--r:20deg;animation-delay:-0.6s\"><path fill=\"#031B0E\" d=\"M10 -10h50v10h-50zM0 0h70v20h-70zM0 20h30v10h-30zM40 20h30v10h-30zM-10 30h80v20h-80zM0 50h20v10h-20zM40 50h20v10h-20z\"/><path fill=\"#A6FFC4\" d=\"M10 0h50v10h-50zM10 10h10v20h-10zM50 10h10v20h-10zM0 30h20v20h-20zM40 30h20v20h-20z\"/></g></g><g transform=\"translate(-55 180)\"><g class=\"fxi note\" style=\"--dx:-35px;--r:-10deg;animation-delay:-1.2s\"><path fill=\"#031B0E\" d=\"M10 -10h50v10h-50zM0 0h70v20h-70zM0 20h30v10h-30zM40 20h30v10h-30zM-10 30h80v20h-80zM0 50h20v10h-20zM40 50h20v10h-20z\"/><path fill=\"#A6FFC4\" d=\"M10 0h50v10h-50zM10 10h10v20h-10zM50 10h10v20h-10zM0 30h20v20h-20zM40 30h20v20h-20z\"/></g></g><g transform=\"translate(355 175)\"><g class=\"fxi note\" style=\"--dx:40px;--r:14deg;animation-delay:-1.8s\"><path fill=\"#031B0E\" d=\"M10 -10h50v10h-50zM0 0h70v20h-70zM0 20h30v10h-30zM40 20h30v10h-30zM-10 30h80v20h-80zM0 50h20v10h-20zM40 50h20v10h-20z\"/><path fill=\"#A6FFC4\" d=\"M10 0h50v10h-50zM10 10h10v20h-10zM50 10h10v20h-10zM0 30h20v20h-20zM40 30h20v20h-20z\"/></g></g></g><g class=\"fx fx-zzz\" display=\"none\"><g transform=\"translate(275 85)\"><g class=\"fxi zed\" style=\"animation-delay:0s\"><path fill=\"#031B0E\" d=\"M0 -10h40v10h-40zM-10 0h60v10h-60zM0 10h40v20h-40zM-10 30h60v10h-60zM0 40h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M0 0h40v10h-40zM20 10h10v10h-10zM10 20h10v10h-10zM0 30h40v10h-40z\"/></g></g><g transform=\"translate(275 85)\"><g class=\"fxi zed\" style=\"animation-delay:-1s\"><path fill=\"#031B0E\" d=\"M0 -10h40v10h-40zM-10 0h60v10h-60zM0 10h40v20h-40zM-10 30h60v10h-60zM0 40h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M0 0h40v10h-40zM20 10h10v10h-10zM10 20h10v10h-10zM0 30h40v10h-40z\"/></g></g><g transform=\"translate(275 85)\"><g class=\"fxi zed\" style=\"animation-delay:-2s\"><path fill=\"#031B0E\" d=\"M0 -10h40v10h-40zM-10 0h60v10h-60zM0 10h40v20h-40zM-10 30h60v10h-60zM0 40h40v10h-40z\"/><path fill=\"#F1FFF5\" d=\"M0 0h40v10h-40zM20 10h10v10h-10zM10 20h10v10h-10zM0 30h40v10h-40z\"/></g></g></g><g class=\"fx fx-bubble\" display=\"none\"><g transform=\"translate(201 283)\"><g class=\"fxi bubble\"><path fill=\"#D9FFE6\" d=\"M10 0h30v10h-30zM0 10h10v30h-10zM40 10h10v30h-10zM10 40h30v10h-30z\"/><path fill=\"#F1FFF5\" d=\"M10 10h10v10h-10z\"/></g></g></g><g class=\"fx fx-hearts\" display=\"none\"><g transform=\"translate(-35 170)\"><g class=\"fxi heart\" style=\"--dx:-25px;animation-delay:0s\"><path fill=\"#031B0E\" d=\"M10 -10h20v10h-20zM40 -10h20v10h-20zM0 0h70v10h-70zM-10 10h90v20h-90zM0 30h70v10h-70zM10 40h50v10h-50zM20 50h30v10h-30zM30 60h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M10 0h20v10h-20zM40 0h20v10h-20zM0 10h10v10h-10zM20 10h50v10h-50zM0 20h70v10h-70zM10 30h50v10h-50zM20 40h30v10h-30zM30 50h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M10 10h10v10h-10z\"/></g></g><g transform=\"translate(40 100)\"><g class=\"fxi heart\" style=\"--dx:-10px;animation-delay:-0.45s\"><path fill=\"#031B0E\" d=\"M10 -10h20v10h-20zM40 -10h20v10h-20zM0 0h70v10h-70zM-10 10h90v20h-90zM0 30h70v10h-70zM10 40h50v10h-50zM20 50h30v10h-30zM30 60h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M10 0h20v10h-20zM40 0h20v10h-20zM0 10h10v10h-10zM20 10h50v10h-50zM0 20h70v10h-70zM10 30h50v10h-50zM20 40h30v10h-30zM30 50h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M10 10h10v10h-10z\"/></g></g><g transform=\"translate(260 80)\"><g class=\"fxi heart\" style=\"--dx:15px;animation-delay:-0.9s\"><path fill=\"#031B0E\" d=\"M10 -10h20v10h-20zM40 -10h20v10h-20zM0 0h70v10h-70zM-10 10h90v20h-90zM0 30h70v10h-70zM10 40h50v10h-50zM20 50h30v10h-30zM30 60h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M10 0h20v10h-20zM40 0h20v10h-20zM0 10h10v10h-10zM20 10h50v10h-50zM0 20h70v10h-70zM10 30h50v10h-50zM20 40h30v10h-30zM30 50h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M10 10h10v10h-10z\"/></g></g><g transform=\"translate(335 180)\"><g class=\"fxi heart\" style=\"--dx:30px;animation-delay:-1.35s\"><path fill=\"#031B0E\" d=\"M10 -10h20v10h-20zM40 -10h20v10h-20zM0 0h70v10h-70zM-10 10h90v20h-90zM0 30h70v10h-70zM10 40h50v10h-50zM20 50h30v10h-30zM30 60h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M10 0h20v10h-20zM40 0h20v10h-20zM0 10h10v10h-10zM20 10h50v10h-50zM0 20h70v10h-70zM10 30h50v10h-50zM20 40h30v10h-30zM30 50h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M10 10h10v10h-10z\"/></g></g><g transform=\"translate(150 20)\"><g class=\"fxi heart\" style=\"--dx:5px;animation-delay:-1.8s\"><path fill=\"#031B0E\" d=\"M10 -10h20v10h-20zM40 -10h20v10h-20zM0 0h70v10h-70zM-10 10h90v20h-90zM0 30h70v10h-70zM10 40h50v10h-50zM20 50h30v10h-30zM30 60h10v10h-10z\"/><path fill=\"#FF4F7B\" d=\"M10 0h20v10h-20zM40 0h20v10h-20zM0 10h10v10h-10zM20 10h50v10h-50zM0 20h70v10h-70zM10 30h50v10h-50zM20 40h30v10h-30zM30 50h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M10 10h10v10h-10z\"/></g></g></g><g class=\"fx fx-sparkle\" display=\"none\"><g transform=\"translate(-60 60)\"><g class=\"fxi sparkle\" style=\"animation-delay:0s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v10h-50zM10 40h30v10h-30zM20 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v20h-10zM0 20h20v10h-20zM30 20h20v10h-20zM20 30h10v20h-10z\"/><path fill=\"#F1FFF5\" d=\"M20 20h10v10h-10z\"/></g></g><g transform=\"translate(385 30)\"><g class=\"fxi sparkle\" style=\"animation-delay:-0.3s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v10h-50zM10 40h30v10h-30zM20 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v20h-10zM0 20h20v10h-20zM30 20h20v10h-20zM20 30h10v20h-10z\"/><path fill=\"#F1FFF5\" d=\"M20 20h10v10h-10z\"/></g></g><g transform=\"translate(-75 259)\"><g class=\"fxi sparkle\" style=\"animation-delay:-0.55s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v10h-50zM10 40h30v10h-30zM20 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v20h-10zM0 20h20v10h-20zM30 20h20v10h-20zM20 30h10v20h-10z\"/><path fill=\"#F1FFF5\" d=\"M20 20h10v10h-10z\"/></g></g><g transform=\"translate(395 249)\"><g class=\"fxi sparkle\" style=\"animation-delay:-0.15s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v10h-50zM10 40h30v10h-30zM20 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v20h-10zM0 20h20v10h-20zM30 20h20v10h-20zM20 30h10v20h-10z\"/><path fill=\"#F1FFF5\" d=\"M20 20h10v10h-10z\"/></g></g><g transform=\"translate(165 -35)\"><g class=\"fxi sparkle\" style=\"animation-delay:-0.7s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v10h-50zM10 40h30v10h-30zM20 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v20h-10zM0 20h20v10h-20zM30 20h20v10h-20zM20 30h10v20h-10z\"/><path fill=\"#F1FFF5\" d=\"M20 20h10v10h-10z\"/></g></g></g><g class=\"fx fx-confetti\" display=\"none\"><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#A6FFC4\" style=\"--dx:-125px;--dy:-26px;--r:576deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FFD447\" style=\"--dx:10px;--dy:-172px;--r:-355deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FF4F7B\" style=\"--dx:32px;--dy:-212px;--r:-315deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#F1FFF5\" style=\"--dx:126px;--dy:-139px;--r:-417deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#7FDBFF\" style=\"--dx:-103px;--dy:-159px;--r:-709deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#56B776\" style=\"--dx:-152px;--dy:-178px;--r:-309deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#A6FFC4\" style=\"--dx:-130px;--dy:-90px;--r:606deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FFD447\" style=\"--dx:-221px;--dy:-89px;--r:538deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FF4F7B\" style=\"--dx:118px;--dy:-215px;--r:682deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#F1FFF5\" style=\"--dx:99px;--dy:-76px;--r:-411deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#7FDBFF\" style=\"--dx:-25px;--dy:-120px;--r:-609deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#56B776\" style=\"--dx:-63px;--dy:-164px;--r:-694deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#A6FFC4\" style=\"--dx:113px;--dy:-177px;--r:-411deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FFD447\" style=\"--dx:-116px;--dy:-73px;--r:395deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FF4F7B\" style=\"--dx:-154px;--dy:-131px;--r:-261deg;animation-delay:0s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#F1FFF5\" style=\"--dx:118px;--dy:-209px;--r:637deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#7FDBFF\" style=\"--dx:101px;--dy:-217px;--r:-494deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#56B776\" style=\"--dx:95px;--dy:-216px;--r:642deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#A6FFC4\" style=\"--dx:64px;--dy:-237px;--r:503deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FFD447\" style=\"--dx:94px;--dy:-76px;--r:397deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FF4F7B\" style=\"--dx:112px;--dy:-155px;--r:709deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#F1FFF5\" style=\"--dx:36px;--dy:-224px;--r:-548deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#7FDBFF\" style=\"--dx:118px;--dy:-151px;--r:-354deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#56B776\" style=\"--dx:-121px;--dy:-25px;--r:640deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#A6FFC4\" style=\"--dx:43px;--dy:-114px;--r:526deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FFD447\" style=\"--dx:142px;--dy:-205px;--r:-713deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#FF4F7B\" style=\"--dx:91px;--dy:-205px;--r:638deg;animation-delay:0.95s\"/></g><g transform=\"translate(173 140)\"><rect class=\"fxi conf\" width=\"14\" height=\"22\" fill=\"#F1FFF5\" style=\"--dx:-211px;--dy:-133px;--r:512deg;animation-delay:0.95s\"/></g></g><g class=\"fx fx-orbit\" display=\"none\"><g transform=\"translate(155 10)\"><g class=\"fxi orb\" style=\"animation-delay:0s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v20h-50zM10 50h10v10h-10zM30 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v10h-10zM10 10h30v10h-30zM0 20h50v10h-50zM10 30h30v10h-30zM10 40h10v10h-10zM30 40h10v10h-10z\"/></g></g><g transform=\"translate(155 10)\"><g class=\"fxi orb\" style=\"animation-delay:-0.4s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v20h-50zM10 50h10v10h-10zM30 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v10h-10zM10 10h30v10h-30zM0 20h50v10h-50zM10 30h30v10h-30zM10 40h10v10h-10zM30 40h10v10h-10z\"/></g></g><g transform=\"translate(155 10)\"><g class=\"fxi orb\" style=\"animation-delay:-0.8s\"><path fill=\"#031B0E\" d=\"M20 -10h10v10h-10zM10 0h30v10h-30zM0 10h50v10h-50zM-10 20h70v10h-70zM0 30h50v20h-50zM10 50h10v10h-10zM30 50h10v10h-10z\"/><path fill=\"#FFD447\" d=\"M20 0h10v10h-10zM10 10h30v10h-30zM0 20h50v10h-50zM10 30h30v10h-30zM10 40h10v10h-10zM30 40h10v10h-10z\"/></g></g></g><g class=\"fx fx-bang\" display=\"none\"><g transform=\"translate(280 -45)\"><g class=\"fxi bang\"><path fill=\"#031B0E\" d=\"M0 -10h30v10h-30zM-10 0h50v40h-50zM0 40h30v20h-30zM-10 60h50v10h-50zM0 70h30v10h-30z\"/><path fill=\"#FFD447\" d=\"M0 0h30v40h-30zM10 40h10v10h-10zM0 60h30v10h-30z\"/></g></g></g><g class=\"fx fx-tears\" display=\"none\"><g transform=\"translate(95 276)\"><g class=\"fxi tear\"><path fill=\"#031B0E\" d=\"M10 -10h10v10h-10zM0 0h30v10h-30zM-10 10h50v20h-50zM0 30h30v10h-30zM10 40h10v10h-10z\"/><path fill=\"#7FDBFF\" d=\"M10 0h10v10h-10zM0 10h30v10h-30zM10 20h20v10h-20zM10 30h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M0 20h10v10h-10z\"/></g></g><g transform=\"translate(235 276)\"><g class=\"fxi tear\" style=\"animation-delay:-.55s\"><path fill=\"#031B0E\" d=\"M10 -10h10v10h-10zM0 0h30v10h-30zM-10 10h50v20h-50zM0 30h30v10h-30zM10 40h10v10h-10z\"/><path fill=\"#7FDBFF\" d=\"M10 0h10v10h-10zM0 10h30v10h-30zM10 20h20v10h-20zM10 30h10v10h-10z\"/><path fill=\"#F1FFF5\" d=\"M0 20h10v10h-10z\"/></g></g></g><g class=\"fx fx-cloud\" display=\"none\"><g transform=\"translate(135 -45)\"><g class=\"fxi cloud\"><path fill=\"#031B0E\" d=\"M30 -10h30v10h-30zM10 0h70v10h-70zM0 10h90v10h-90zM-10 20h110v10h-110zM0 30h90v10h-90zM10 40h70v10h-70z\"/><path fill=\"#B4C2BA\" d=\"M30 0h30v10h-30zM10 10h70v10h-70zM0 20h90v10h-90zM10 30h70v10h-70z\"/></g></g><g transform=\"translate(150 2)\"><g class=\"fxi drop\" style=\"animation-delay:0.3s\"><path fill=\"#031B0E\" d=\"M0 -10h10v10h-10zM-10 0h30v20h-30zM0 20h10v10h-10z\"/><path fill=\"#7FDBFF\" d=\"M0 0h10v20h-10z\"/></g></g><g transform=\"translate(180 2)\"><g class=\"fxi drop\" style=\"animation-delay:0.55s\"><path fill=\"#031B0E\" d=\"M0 -10h10v10h-10zM-10 0h30v20h-30zM0 20h10v10h-10z\"/><path fill=\"#7FDBFF\" d=\"M0 0h10v20h-10z\"/></g></g><g transform=\"translate(205 2)\"><g class=\"fxi drop\" style=\"animation-delay:0.4s\"><path fill=\"#031B0E\" d=\"M0 -10h10v10h-10zM-10 0h30v20h-30zM0 20h10v10h-10z\"/><path fill=\"#7FDBFF\" d=\"M0 0h10v20h-10z\"/></g></g></g><g class=\"fx fx-dots\" display=\"none\"><g transform=\"translate(250 25)\"><g class=\"fxi dot\" style=\"animation-delay:.2s\"><path fill=\"#031B0E\" d=\"M0 -10h20v10h-20zM-10 0h40v20h-40zM0 20h20v10h-20z\"/><path fill=\"#F1FFF5\" d=\"M0 0h20v20h-20z\"/></g></g><g transform=\"translate(280 -5)\"><g class=\"fxi dot\" style=\"animation-delay:.55s\"><path fill=\"#031B0E\" d=\"M0 -10h20v10h-20zM-10 0h40v20h-40zM0 20h20v10h-20z\"/><path fill=\"#F1FFF5\" d=\"M0 0h20v20h-20z\"/></g></g><g transform=\"translate(310 -45)\"><g class=\"fxi dot\" style=\"animation-delay:.9s\"><path fill=\"#031B0E\" d=\"M0 -10h30v10h-30zM-10 0h50v30h-50zM0 30h30v10h-30z\"/><path fill=\"#F1FFF5\" d=\"M0 0h30v30h-30z\"/></g></g></g>","viewBox":"-70 -60 500 470","css":":host{aspect-ratio:500/470}\n.rig,.squash,.shadow{transform-origin:180px 392px}\n.tilt{transform-origin:180px 270px}\n.p-hornL{transform-origin:105px 165px}.p-hornR{transform-origin:255px 165px}\n.p-armL{transform-origin:55px 285px}.p-armR{transform-origin:305px 285px}\n.eyeL,.eyeL .blinker,.eyeL .ev{transform-origin:110px 242px}.eyeR,.eyeR .blinker,.eyeR .ev{transform-origin:250px 242px}\n.eyeL .spin{transform-origin:110px 240px}.eyeR .spin{transform-origin:250px 240px}\n.mv{transform-origin:180px 298px}","eyeAt":[0.5,0.6425531914893617]}/*END*/;

  const STATES = {
    idle:   { eyes: 'normal', mouth: 'smile' },
    music:  { eyes: 'happy',  mouth: 'smile' },
    laptop: { eyes: 'normal', mouth: 'flat', look: [0, .75] },
    sleep:  { eyes: 'closed', mouth: 'small' },
  };

  const REACTIONS = {
    celebrate: { ms: 2600, eyes: 'star',   mouth: 'grin', blush: true },
    cheer:     { ms: 1500, eyes: 'happy',  mouth: 'grin', blush: true },
    shock:     { ms: 1400, eyes: 'wide',   mouth: 'o' },
    sad:       { ms: 2800, eyes: 'sad',    mouth: 'frown', look: [0, .5] },
    dizzy:     { ms: 2600, eyes: 'spiral', mouth: 'wavy' },
    love:      { ms: 2600, eyes: 'heart',  mouth: 'smile', blush: true },
    wave:      { ms: 2200, eyes: 'happy',  mouth: 'grin' },
    dance:     { ms: 3200, eyes: 'happy',  mouth: 'grin' },
    hype:      { ms: 2600, eyes: 'angry',  mouth: 'grin' },
    spin:      { ms: 1500, eyes: 'happy',  mouth: 'grin' },
    glitch:    { ms: 1200, eyes: 'normal', mouth: 'wavy' },
    think:     { ms: 2800, eyes: 'normal', mouth: 'flat', look: [.7, -.8] },
    yawn:      { ms: 2400, eyes: 'closed', mouth: 'o' },
    wake:      { ms: 900,  eyes: 'wide',   mouth: 'o' },
  };

  const BLINKABLE = new Set(['normal', 'wide', 'sad', 'angry']);

  const CSS = `
:host{display:inline-block;position:relative;width:320px;container-type:inline-size;user-select:none}
.b{position:absolute;inset:0;--lx:0;--ly:0}
svg{width:100%;height:100%;display:block;overflow:visible}

/* ---------- rig (pivot points come with the ART block, since they follow Byte's proportions) ---------- */
.tilt,.p-hornL,.p-hornR{transition:transform .6s ease}
.p-armL{transform:translate(70px,0)}
.p-armR{transform:translate(-70px,0)}
.look{transform:translate(calc(var(--lx)*14px),calc(var(--ly)*9px));transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.mlook{transform:translate(calc(var(--lx)*6px),calc(var(--ly)*4px));transition:transform .35s cubic-bezier(.34,1.56,.64,1)}
.eye{transition:transform .2s cubic-bezier(.34,1.56,.64,1)}
.blinker{transition:transform 70ms}
.b.blink .blinker{transform:scaleY(.1)}
.fxi{transform-box:fill-box;transform-origin:50% 50%}

/* ---------- expressions ---------- */
.ev,.mv,.blush{display:none}
.b[data-eyes=normal] .ev-normal,.b[data-eyes=wide] .ev-normal,.b[data-eyes=happy] .ev-happy,
.b[data-eyes=closed] .ev-closed,.b[data-eyes=sad] .ev-sad,.b[data-eyes=angry] .ev-angry,
.b[data-eyes=star] .ev-star,.b[data-eyes=heart] .ev-heart,.b[data-eyes=spiral] .ev-spiral,
.b[data-mouth=smile] .mv-smile,.b[data-mouth=grin] .mv-grin,.b[data-mouth=o] .mv-o,.b[data-mouth=small] .mv-small,
.b[data-mouth=flat] .mv-flat,.b[data-mouth=frown] .mv-frown,.b[data-mouth=wavy] .mv-wavy,
.b[data-blush] .blush{display:inline}
.b[data-eyes=wide] .eye{transform:scale(1.25)}

/* ---------- looping states ---------- */
.b[data-state=idle] .rig{animation:bob 3s ease-in-out infinite}
.b[data-state=idle] .squash{animation:breathe 3s ease-in-out infinite}
.b[data-state=idle] .p-hornL{animation:twitchL 5s ease-in-out infinite}
.b[data-state=idle] .p-hornR{animation:twitchR 5s ease-in-out 2.1s infinite}

.b[data-state=music] .squash{animation:bop .5s ease-in-out infinite}
.b[data-state=music] .tilt{animation:sway 1s ease-in-out infinite}
.b[data-state=music] .p-hornL{animation:hornBopL .5s ease-in-out infinite}
.b[data-state=music] .p-hornR{animation:hornBopR .5s ease-in-out infinite}
.b[data-state=music] .p-legL{animation:tap .5s ease-in-out infinite}
.b[data-state=music] .p-legR{animation:tap .5s ease-in-out .25s infinite}
.b[data-state=music] .led{animation:ledPulse .5s steps(1) infinite}
.b[data-state=music] .fx-notes{display:inline}

.laptop{opacity:0;transform:translateY(150px);transition:transform .45s cubic-bezier(.34,1.3,.64,1),opacity .3s;pointer-events:none}
.b[data-state=laptop] .laptop{opacity:1;transform:none}
.b[data-state=laptop] .rig{animation:typeBob .32s ease-in-out infinite}
.b[data-state=laptop] .p-hornL{animation:twitchL 6s ease-in-out infinite}
.b[data-state=laptop] .p-hornR{animation:twitchR 6s ease-in-out 3s infinite}
.b[data-state=laptop] .mittL{animation:tapMitt .22s ease-in-out infinite alternate}
.b[data-state=laptop] .mittR{animation:tapMitt .22s ease-in-out .11s infinite alternate}
.screen-glow{animation:glow 3s steps(3) infinite}
.bulb{animation:glow 1.6s steps(2) infinite}
.glyph{animation:glyph 2.6s ease-out infinite both}

.b[data-state=sleep] .squash{animation:snore 4s ease-in-out infinite}
.b[data-state=sleep] .tilt{transform:rotate(6deg)}
.b[data-state=sleep] .p-hornL{transform:rotate(-16deg)}
.b[data-state=sleep] .p-hornR{transform:rotate(16deg)}
.b[data-state=sleep] .led{opacity:.3}
.b[data-state=sleep] :is(.fx-zzz,.fx-bubble){display:inline}

/* ---------- reactions: switch off the loop, then play ---------- */
.b[data-react] :is(.rig,.squash,.tilt,.p-hornL,.p-hornR,.p-legL,.p-legR,.led){animation:none}
.b[data-react] :is(.tilt,.p-hornL,.p-hornR){transform:none}
.b[data-react] :is(.fx-notes,.fx-zzz,.fx-bubble,.mitts,.glyphs){display:none}

.b[data-react=celebrate] .rig{animation:jump2 2.6s both}
.b[data-react=celebrate] .squash{animation:jump2Sq 2.6s both}
.b[data-react=celebrate] .shadow{animation:shadow2 2.6s both}
.b[data-react=celebrate] .p-hornL{animation:flapL .26s ease-in-out 10 alternate}
.b[data-react=celebrate] .p-hornR{animation:flapR .26s ease-in-out 10 alternate}
.b[data-react=celebrate] .p-armL{animation:cheerL 2.6s both}
.b[data-react=celebrate] .p-armR{animation:cheerR 2.6s both}
.b[data-react=celebrate] .ev-star{animation:pulse .3s ease-in-out infinite alternate}
.b[data-react=celebrate] :is(.fx-confetti,.fx-sparkle){display:inline}

.b[data-react=cheer] .rig{animation:hop 1.5s both}
.b[data-react=cheer] .squash{animation:hopSq 1.5s both}
.b[data-react=cheer] .shadow{animation:shadowHop 1.5s both}
.b[data-react=cheer] .p-armL{animation:armsUpL 1.5s both}
.b[data-react=cheer] .p-armR{animation:armsUpR 1.5s both}
.b[data-react=cheer] .p-hornL{animation:flapL .2s ease-in-out 6 alternate}
.b[data-react=cheer] .p-hornR{animation:flapR .2s ease-in-out 6 alternate}
.b[data-react=cheer] .fx-sparkle{display:inline}

.b[data-react=shock] .rig{animation:jolt 1.4s both}
.b[data-react=shock] .squash{animation:joltSq 1.4s both}
.b[data-react=shock] .p-hornL{animation:perkL 1.4s both}
.b[data-react=shock] .p-hornR{animation:perkR 1.4s both}
.b[data-react=shock] .fx-bang{display:inline}

.b[data-react=sad] .rig{animation:sink 2.8s ease-in-out both}
.b[data-react=sad] .squash{animation:sadSq 2.8s ease-in-out both}
.b[data-react=sad] .tilt{animation:sadTilt 2.8s ease-in-out both}
.b[data-react=sad] .p-hornL{animation:droopL 2.8s ease-in-out both}
.b[data-react=sad] .p-hornR{animation:droopR 2.8s ease-in-out both}
.b[data-react=sad] :is(.fx-tears,.fx-cloud){display:inline}

.b[data-react=dizzy] .tilt{animation:wobble 2.6s ease-in-out both}
.b[data-react=dizzy] .rig{animation:wobbleX 2.6s ease-in-out both}
.b[data-react=dizzy] .spin{animation:spin .8s linear infinite}
.b[data-react=dizzy] .p-hornL{animation:flapL .4s ease-in-out infinite alternate}
.b[data-react=dizzy] .p-hornR{animation:flapR .4s ease-in-out .2s infinite alternate}
.b[data-react=dizzy] .fx-orbit{display:inline}

.b[data-react=love] .rig{animation:float 2.6s ease-in-out both}
.b[data-react=love] .tilt{animation:rock 1.3s ease-in-out 2}
.b[data-react=love] .ev-heart{animation:pulse .4s ease-in-out infinite alternate}
.b[data-react=love] .fx-hearts{display:inline}

.b[data-react=wave] .p-armR{animation:waveR 2.2s both}
.b[data-react=wave] .tilt{animation:lean 2.2s ease-in-out both}
.b[data-react=wave] .rig{animation:bounce .55s ease-in-out 4}
.b[data-react=wave] .p-hornR{animation:flapR .3s ease-in-out 7 alternate}

.b[data-react=dance] .rig{animation:danceRig .8s ease-in-out 4}
.b[data-react=dance] .squash{animation:bop .4s ease-in-out 8}
.b[data-react=dance] .tilt{animation:danceTilt .8s ease-in-out 4}
.b[data-react=dance] .p-armL{animation:danceL .8s ease-in-out 4}
.b[data-react=dance] .p-armR{animation:danceR .8s ease-in-out 4}
.b[data-react=dance] .p-legL{animation:tap .4s ease-in-out 8}
.b[data-react=dance] .p-legR{animation:tap .4s ease-in-out .2s 8}
.b[data-react=dance] .p-hornL{animation:hornBopL .4s ease-in-out 8}
.b[data-react=dance] .p-hornR{animation:hornBopR .4s ease-in-out 8}
.b[data-react=dance] .shadow{animation:danceShadow .8s ease-in-out 4}
.b[data-react=dance] .fx-notes{display:inline}

.b[data-react=hype] .rig{animation:shake .1s steps(2) infinite}
.b[data-react=hype] .squash{animation:pump .3s ease-in-out infinite alternate}
.b[data-react=hype] .p-legL{animation:tap .18s ease-in-out infinite}
.b[data-react=hype] .p-legR{animation:tap .18s ease-in-out .09s infinite}
.b[data-react=hype] .p-hornL{animation:flapL .12s linear infinite alternate}
.b[data-react=hype] .p-hornR{animation:flapR .12s linear infinite alternate}
.b[data-react=hype] .fx-flames{display:inline;animation:fadeIn .25s both}

.b[data-react=spin] .rig{animation:spinRig 1.5s both}
.b[data-react=spin] .tilt{animation:spinTilt 1.5s cubic-bezier(.5,0,.3,1) both}
.b[data-react=spin] .squash{animation:spinSq 1.5s both}
.b[data-react=spin] .shadow{animation:shadowSpin 1.5s both}
.b[data-react=spin] .fx-sparkle{display:inline}

.b[data-react=glitch] .rig{animation:glitch 1.2s steps(1) both}

.b[data-react=think] .tilt{animation:ponder 2.8s ease-in-out both}
.b[data-react=think] .p-hornR{animation:twitchR 1.4s ease-in-out 2}
.b[data-react=think] .fx-dots{display:inline}

.b[data-react=yawn] .squash{animation:yawnSq 2.4s ease-in-out both}
.b[data-react=yawn] .tilt{animation:yawnTilt 2.4s ease-in-out both}
.b[data-react=yawn] .p-armL{animation:stretchL 2.4s ease-in-out both}
.b[data-react=yawn] .p-armR{animation:stretchR 2.4s ease-in-out both}
.b[data-react=yawn] .p-hornL{animation:stretchHornL 2.4s ease-in-out both}
.b[data-react=yawn] .p-hornR{animation:stretchHornR 2.4s ease-in-out both}
.b[data-react=yawn] .mv-o{animation:yawnMouth 2.4s ease-in-out both}

.b[data-react=wake] .rig{animation:jolt .9s both}
.b[data-react=wake] .squash{animation:joltSq .9s both}
.b[data-react=wake] .p-hornL{animation:perkL .9s both}
.b[data-react=wake] .p-hornR{animation:perkR .9s both}

/* ---------- effects ---------- */
.note{animation:note 2.4s ease-out infinite both}
.zed{animation:zed 3s ease-out infinite both}
.bubble{transform-origin:0 60%;animation:bubble 4s ease-in-out infinite}
.heart{animation:heart 2.2s ease-out infinite both}
.sparkle{animation:twinkle .9s ease-in-out infinite both}
.orb{animation:orbit 1.2s linear infinite}
.bang{transform-origin:50% 100%;animation:bang 1.4s both}
.tear{animation:tear 1.2s ease-in infinite both}
.cloud{animation:cloud 2.8s ease-in-out both}
.drop{animation:drop .7s linear infinite both}
.flame{transform-origin:50% 100%;animation:flicker .3s ease-in-out infinite alternate}
.dot{animation:dot 2.8s both}
.conf{animation:conf 2s cubic-bezier(.15,.7,.4,1) both}

/* ---------- speech bubble ---------- */
.say{position:absolute;left:50%;top:-3%;transform:translate(-50%,0) scale(0);transform-origin:50% 130%;
  font:400 clamp(9px,4.4cqw,30px)/1.35 "Press Start 2P",ui-monospace,monospace;color:#031B0E;background:#F1FFF5;
  padding:2.4cqw 3.2cqw;white-space:nowrap;pointer-events:none;
  box-shadow:0 -1cqw 0 #031B0E,0 1cqw 0 #031B0E,-1cqw 0 0 #031B0E,1cqw 0 0 #031B0E;
  transition:transform .22s cubic-bezier(.34,1.56,.64,1)}
.say.on{transform:translate(-50%,0) scale(1)}
.say::after{content:"";position:absolute;left:50%;top:100%;width:3cqw;height:2.4cqw;transform:translateX(-50%);background:#F1FFF5;
  box-shadow:1cqw 0 0 #031B0E,-1cqw 0 0 #031B0E,0 1cqw 0 #031B0E}

/* ---------- keyframes ---------- */
@keyframes bob{50%{transform:translateY(-4px)}}
@keyframes breathe{50%{transform:scale(.99,1.015)}}
@keyframes twitchL{0%,78%,100%{transform:rotate(0)}83%{transform:rotate(-8deg)}88%{transform:rotate(4deg)}93%{transform:rotate(-2deg)}}
@keyframes twitchR{0%,78%,100%{transform:rotate(0)}83%{transform:rotate(8deg)}88%{transform:rotate(-4deg)}93%{transform:rotate(2deg)}}
@keyframes bop{0%,100%{transform:scale(1.03,.96)}50%{transform:scale(.98,1.03)}}
@keyframes sway{0%,100%{transform:rotate(-4deg)}50%{transform:rotate(4deg)}}
@keyframes hornBopL{0%,100%{transform:rotate(-6deg)}50%{transform:rotate(3deg)}}
@keyframes hornBopR{0%,100%{transform:rotate(6deg)}50%{transform:rotate(-3deg)}}
@keyframes tap{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes ledPulse{50%{opacity:.35}}
@keyframes typeBob{50%{transform:translateY(1.5px)}}
@keyframes tapMitt{to{transform:translateY(9px)}}
@keyframes glow{0%,100%{opacity:1}33%{opacity:.72}66%{opacity:.9}}
@keyframes snore{0%,100%{transform:scale(1.015,.975)}50%{transform:scale(.99,1.02)}}
@keyframes fadeIn{from{opacity:0}}

@keyframes jump2{
  0%,8%{transform:translateY(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}
  22%{transform:translateY(-95px);animation-timing-function:cubic-bezier(.6,0,.8,.3)}
  34%{transform:translateY(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}
  46%{transform:translateY(-70px);animation-timing-function:cubic-bezier(.6,0,.8,.3)}
  58%{transform:translateY(0);animation-timing-function:ease-out}
  65%{transform:translateY(-12px);animation-timing-function:ease-in}
  72%,100%{transform:translateY(0)}}
@keyframes jump2Sq{0%{transform:none}7%{transform:scale(1.16,.82)}12%{transform:scale(.88,1.15)}24%{transform:none}
  34%{transform:scale(1.18,.8)}38%{transform:scale(.9,1.12)}48%{transform:none}58%{transform:scale(1.12,.86)}64%,100%{transform:none}}
@keyframes shadow2{0%,8%,34%,58%,100%{transform:none;opacity:.28}22%{transform:scale(.55);opacity:.12}46%{transform:scale(.65);opacity:.15}}
@keyframes flapL{from{transform:rotate(-12deg)}to{transform:rotate(6deg)}}
@keyframes flapR{from{transform:rotate(12deg)}to{transform:rotate(-6deg)}}
@keyframes cheerL{0%{transform:translate(70px,0) rotate(0)}8%{transform:translate(0,0) rotate(10deg)}16%{transform:translate(0,0) rotate(40deg)}
  26%{transform:translate(0,0) rotate(22deg)}36%{transform:translate(0,0) rotate(45deg)}46%{transform:translate(0,0) rotate(22deg)}
  56%{transform:translate(0,0) rotate(40deg)}80%{transform:translate(0,0) rotate(35deg)}92%{transform:translate(0,0) rotate(0)}100%{transform:translate(70px,0) rotate(0)}}
@keyframes cheerR{0%{transform:translate(-70px,0) rotate(0)}8%{transform:translate(0,0) rotate(-10deg)}16%{transform:translate(0,0) rotate(-40deg)}
  26%{transform:translate(0,0) rotate(-22deg)}36%{transform:translate(0,0) rotate(-45deg)}46%{transform:translate(0,0) rotate(-22deg)}
  56%{transform:translate(0,0) rotate(-40deg)}80%{transform:translate(0,0) rotate(-35deg)}92%{transform:translate(0,0) rotate(0)}100%{transform:translate(-70px,0) rotate(0)}}
@keyframes pulse{to{transform:scale(1.2)}}

@keyframes hop{
  0%,10%{transform:translateY(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}
  30%{transform:translateY(-60px);animation-timing-function:cubic-bezier(.6,0,.8,.3)}
  48%{transform:translateY(0);animation-timing-function:ease-out}
  58%{transform:translateY(-10px);animation-timing-function:ease-in}
  68%,100%{transform:translateY(0)}}
@keyframes hopSq{0%{transform:none}9%{transform:scale(1.15,.83)}15%{transform:scale(.88,1.14)}30%{transform:none}48%{transform:scale(1.14,.85)}56%{transform:scale(.97,1.03)}66%,100%{transform:none}}
@keyframes shadowHop{0%,10%,48%,100%{transform:none;opacity:.28}30%{transform:scale(.6);opacity:.14}}
@keyframes armsUpL{0%{transform:translate(70px,0) rotate(0)}10%{transform:translate(0,0) rotate(10deg)}22%,72%{transform:translate(0,0) rotate(38deg)}88%{transform:translate(0,0) rotate(0)}100%{transform:translate(70px,0) rotate(0)}}
@keyframes armsUpR{0%{transform:translate(-70px,0) rotate(0)}10%{transform:translate(0,0) rotate(-10deg)}22%,72%{transform:translate(0,0) rotate(-38deg)}88%{transform:translate(0,0) rotate(0)}100%{transform:translate(-70px,0) rotate(0)}}

@keyframes jolt{0%{transform:translate(0,0);animation-timing-function:cubic-bezier(.2,.9,.3,1)}10%{transform:translate(0,-36px);animation-timing-function:ease-in}
  22%{transform:translate(0,0)}26%{transform:translate(-3px,0)}30%{transform:translate(3px,0)}34%{transform:translate(-3px,0)}38%{transform:translate(3px,0)}
  42%{transform:translate(-2px,0)}46%{transform:translate(2px,0)}50%{transform:translate(-1px,0)}54%,100%{transform:translate(0,0)}}
@keyframes joltSq{0%{transform:none}5%{transform:scale(1.1,.86)}11%{transform:scale(.84,1.2)}23%{transform:scale(1.08,.92)}32%,100%{transform:none}}
@keyframes perkL{0%,100%{transform:translate(0,0) rotate(0)}10%,70%{transform:translate(0,-10px) rotate(10deg)}}
@keyframes perkR{0%,100%{transform:translate(0,0) rotate(0)}10%,70%{transform:translate(0,-10px) rotate(-10deg)}}

@keyframes sink{20%,85%{transform:translateY(6px)}}
@keyframes sadSq{20%,85%{transform:scale(1.04,.92)}}
@keyframes sadTilt{20%,85%{transform:rotate(-3deg)}}
@keyframes droopL{20%,85%{transform:rotate(-30deg)}}
@keyframes droopR{20%,85%{transform:rotate(30deg)}}

@keyframes wobble{12%{transform:rotate(-14deg)}28%{transform:rotate(12deg)}44%{transform:rotate(-10deg)}60%{transform:rotate(8deg)}76%{transform:rotate(-5deg)}90%{transform:rotate(2deg)}}
@keyframes wobbleX{12%{transform:translateX(-14px)}28%{transform:translateX(12px)}44%{transform:translateX(-9px)}60%{transform:translateX(6px)}76%{transform:translateX(-3px)}}
@keyframes spin{to{transform:rotate(360deg)}}

@keyframes float{25%,75%{transform:translateY(-16px)}50%{transform:translateY(-22px)}}
@keyframes rock{25%{transform:rotate(-5deg)}75%{transform:rotate(5deg)}}

@keyframes waveR{0%{transform:translate(-70px,0) rotate(0)}10%{transform:translate(0,0) rotate(-20deg)}18%{transform:translate(0,0) rotate(-60deg)}
  28%{transform:translate(0,0) rotate(-30deg)}38%{transform:translate(0,0) rotate(-60deg)}48%{transform:translate(0,0) rotate(-30deg)}
  58%{transform:translate(0,0) rotate(-60deg)}68%{transform:translate(0,0) rotate(-30deg)}80%{transform:translate(0,0) rotate(-45deg)}
  92%{transform:translate(0,0) rotate(0)}100%{transform:translate(-70px,0) rotate(0)}}
@keyframes lean{12%,80%{transform:rotate(-4deg)}}
@keyframes bounce{50%{transform:translateY(-6px)}}

@keyframes danceRig{0%,50%,100%{transform:translate(0,0)}25%{transform:translate(-20px,-22px)}75%{transform:translate(20px,-22px)}}
@keyframes danceTilt{25%{transform:rotate(-9deg)}75%{transform:rotate(9deg)}}
@keyframes danceL{0%,100%{transform:translate(0,0) rotate(-25deg)}50%{transform:translate(0,0) rotate(55deg)}}
@keyframes danceR{0%,100%{transform:translate(0,0) rotate(-55deg)}50%{transform:translate(0,0) rotate(25deg)}}
@keyframes danceShadow{25%{transform:translateX(-20px) scale(.8)}75%{transform:translateX(20px) scale(.8)}}

@keyframes shake{0%{transform:translate(-2px,1px)}50%{transform:translate(2px,-1px)}100%{transform:translate(-1px,0)}}
@keyframes pump{from{transform:scale(1.05,.95)}to{transform:scale(.97,1.05)}}

@keyframes spinRig{
  0%,10%{transform:translateY(0);animation-timing-function:cubic-bezier(.2,.8,.4,1)}
  42%{transform:translateY(-85px);animation-timing-function:cubic-bezier(.6,0,.8,.3)}
  74%{transform:translateY(0);animation-timing-function:ease-out}
  84%{transform:translateY(-10px);animation-timing-function:ease-in}
  92%,100%{transform:translateY(0)}}
@keyframes spinTilt{0%,12%{transform:rotate(0)}72%,100%{transform:rotate(360deg)}}
@keyframes spinSq{0%{transform:none}7%{transform:scale(1.14,.84)}13%{transform:scale(.9,1.12)}28%{transform:none}74%{transform:scale(1.14,.85)}82%,100%{transform:none}}
@keyframes shadowSpin{0%,10%,74%,100%{transform:none;opacity:.28}42%{transform:scale(.55);opacity:.12}}

@keyframes glitch{
  0%{transform:none;filter:none}
  8%{transform:translate(-9px,0) skewX(-10deg);filter:drop-shadow(8px 0 0 #FF2D75) drop-shadow(-8px 0 0 #2DE1FF)}
  16%{transform:translate(7px,0);filter:drop-shadow(-8px 0 0 #FF2D75) drop-shadow(8px 0 0 #2DE1FF)}
  24%{transform:none;filter:none}
  40%{transform:translate(11px,-3px) skewX(8deg);filter:drop-shadow(9px 0 0 #FF2D75) drop-shadow(-9px 0 0 #2DE1FF);opacity:.8}
  48%{transform:translate(-4px,2px);opacity:1}
  56%{transform:none;filter:none}
  72%{transform:translate(-7px,0) skewX(-6deg);filter:drop-shadow(6px 0 0 #FF2D75) drop-shadow(-6px 0 0 #2DE1FF)}
  80%,100%{transform:none;filter:none}}

@keyframes ponder{15%,85%{transform:rotate(6deg)}}

@keyframes yawnSq{40%,65%{transform:scale(.94,1.1)}82%{transform:scale(1.03,.97)}}
@keyframes yawnTilt{40%,65%{transform:rotate(-3deg)}}
@keyframes stretchL{0%,100%{transform:translate(70px,0) rotate(0)}25%{transform:translate(0,0) rotate(20deg)}40%,65%{transform:translate(0,0) rotate(38deg)}85%{transform:translate(0,0) rotate(0)}}
@keyframes stretchR{0%,100%{transform:translate(-70px,0) rotate(0)}25%{transform:translate(0,0) rotate(-20deg)}40%,65%{transform:translate(0,0) rotate(-38deg)}85%{transform:translate(0,0) rotate(0)}}
@keyframes stretchHornL{40%,65%{transform:rotate(-8deg)}}
@keyframes stretchHornR{40%,65%{transform:rotate(8deg)}}
@keyframes yawnMouth{0%{transform:scale(.5)}40%,65%{transform:scale(1.35,1.6)}100%{transform:scale(.7)}}

@keyframes note{0%{transform:translate(0,0) scale(.3);opacity:0}15%{opacity:1;transform:translate(calc(var(--dx)*.15),-15px) scale(1)}100%{transform:translate(var(--dx),-120px) rotate(var(--r));opacity:0}}
@keyframes zed{0%{transform:translate(0,0) scale(.4);opacity:0}20%{opacity:1}100%{transform:translate(55px,-110px) scale(1.5) rotate(12deg);opacity:0}}
@keyframes bubble{0%,100%{transform:scale(1)}50%{transform:scale(.25)}}
@keyframes heart{0%{transform:translate(0,20px) scale(.2);opacity:0}20%{opacity:1;transform:translate(0,0) scale(.8)}100%{transform:translate(var(--dx),-130px) scale(.6);opacity:0}}
@keyframes twinkle{0%,100%{transform:scale(0) rotate(0)}50%{transform:scale(1.1) rotate(45deg)}}
@keyframes orbit{0%{transform:translate(120px,0) scale(1)}12.5%{transform:translate(85px,17px) scale(1.15)}25%{transform:translate(0,24px) scale(1.25)}
  37.5%{transform:translate(-85px,17px) scale(1.15)}50%{transform:translate(-120px,0) scale(1)}62.5%{transform:translate(-85px,-17px) scale(.8)}
  75%{transform:translate(0,-24px) scale(.7)}87.5%{transform:translate(85px,-17px) scale(.8)}100%{transform:translate(120px,0) scale(1)}}
@keyframes bang{0%{transform:scale(0) rotate(-20deg)}12%{transform:scale(1.35) rotate(8deg)}22%,75%{transform:scale(1) rotate(10deg);opacity:1}100%{transform:scale(.8) rotate(10deg);opacity:0}}
@keyframes tear{0%{transform:translateY(0) scale(.4);opacity:0}15%{opacity:1;transform:translateY(0) scale(1)}100%{transform:translateY(80px) scale(.9);opacity:0}}
@keyframes cloud{0%{transform:translateY(-30px);opacity:0}15%,85%{transform:translateY(0);opacity:1}50%{transform:translate(6px,0)}100%{opacity:0}}
@keyframes drop{0%{transform:translateY(0);opacity:0}20%{opacity:1}100%{transform:translateY(60px);opacity:0}}
@keyframes flicker{from{transform:scale(var(--s),calc(var(--s)*.85)) skewX(5deg)}to{transform:scale(calc(var(--s)*1.05),calc(var(--s)*1.15)) skewX(-5deg)}}
@keyframes dot{0%{transform:scale(0)}8%{transform:scale(1.3)}14%,88%{transform:scale(1)}100%{transform:scale(0)}}
@keyframes glyph{0%{transform:translate(0,30px);opacity:0}20%{opacity:1}100%{transform:translate(var(--dx),-90px);opacity:0}}
@keyframes conf{0%{transform:translate(0,0) scale(0)}8%{transform:translate(0,0) scale(1)}45%{transform:translate(var(--dx),var(--dy)) rotate(calc(var(--r)*.5))}
  100%{transform:translate(calc(var(--dx)*1.25),calc(var(--dy) + 280px)) rotate(var(--r));opacity:0}}

/* reduced motion: expressions still change, but instantly, and without effects */
@media (prefers-reduced-motion:reduce){
  *{animation:none!important;transition:none!important}
  .fx{display:none!important}
}
`;

  const wait = ms => new Promise(r => setTimeout(r, ms));
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp = v => Math.max(-1, Math.min(1, v));

  class ByteMascot extends HTMLElement {
    static observedAttributes = ['state', 'attract'];
    static STATES = Object.keys(STATES);
    static REACTIONS = Object.keys(REACTIONS);

    #el; #bubble; #art; #base = 'idle'; #cfg = STATES.idle; #reacting = null;
    #queue = Promise.resolve(); #pending = 0; #timers = new Set(); #lookUntil = 0; #sayTimer = 0; #run = 0;

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.#render(ART);
      this.#apply(STATES.idle);
    }

    /** Swap in freshly generated art, e.g. from byte-art.mjs (designer.html uses this for live previews). */
    setArt(art) {
      this.#render(art);
      this.#apply(this.#cfg);
      if (this.#reacting) this.#el.dataset.react = this.#reacting;
    }

    #render(art) {
      this.#art = art;
      this.shadowRoot.innerHTML = `<style>${CSS}${art.css}</style><div class="b">`
        + `<svg viewBox="${art.viewBox}" role="img" aria-label="Byte, the Binary Brains mascot">${art.markup}</svg><div class="say"></div></div>`;
      this.#el = this.shadowRoot.querySelector('.b');
      this.#bubble = this.shadowRoot.querySelector('.say');
    }

    connectedCallback() {
      this.#every(2200, 5200, () => this.#blink());
      this.#every(3000, 7000, () => this.#fidget());
      if (this.attract) this.#autopilot();
    }

    disconnectedCallback() {
      this.#timers.forEach(clearTimeout);
      this.#timers.clear();
      this.#run++;
    }

    attributeChangedCallback(name, _, value) {
      if (name === 'state' && STATES[value] && value !== this.#base) {
        this.#base = value;
        if (this.#reacting) this.#el.dataset.state = value;
        else this.#apply(STATES[value]);
      }
      if (name === 'attract' && this.isConnected) value === null ? this.#run++ : this.#autopilot();
    }

    get state() { return this.#base; }
    set state(v) { this.setAttribute('state', v); }
    get attract() { return this.hasAttribute('attract'); }
    set attract(on) { this.toggleAttribute('attract', Boolean(on)); }

    /** Play a one-shot reaction. Queued behind any reaction already playing; bursts beyond 3 are dropped. */
    react(name, { say } = {}) {
      if (!REACTIONS[name] || this.#pending >= 3) return Promise.resolve();
      this.#pending++;
      const job = this.#queue.then(() => this.#play(name, say)).finally(() => this.#pending--);
      this.#queue = job.catch(() => {});
      return job;
    }

    say(text, ms = 2600) {
      const b = this.#bubble;
      b.textContent = text;
      b.classList.remove('on');
      void b.offsetWidth;
      b.classList.add('on');
      clearTimeout(this.#sayTimer);
      this.#sayTimer = setTimeout(() => b.classList.remove('on'), ms);
    }

    /** Point the eyes: x and y from -1 to 1. They drift back after `ms`. */
    look(x = 0, y = 0, ms = 1600) {
      this.#setLook(x, y);
      this.#lookUntil = Date.now() + ms;
      this.#after(ms, () => Date.now() >= this.#lookUntil && this.#setLook(...(this.#cfg.look || [0, 0])));
    }

    /** Glance at an element (e.g. the leaderboard row that changed) or a {x, y} client point. */
    lookAt(target, ms) {
      const r = this.getBoundingClientRect(), [ex, ey] = this.#art.eyeAt;
      const t = target instanceof Element ? target.getBoundingClientRect() : { left: target.x, top: target.y, width: 0, height: 0 };
      this.look((t.left + t.width / 2 - r.left - r.width * ex) / (r.width * .6),
                (t.top + t.height / 2 - r.top - r.height * ey) / (r.height * .6), ms);
    }

    async #play(name, say) {
      if (this.#base === 'sleep' && name !== 'wake' && name !== 'yawn') await this.#play('wake');
      const cfg = REACTIONS[name];
      this.#reacting = name;
      this.#el.removeAttribute('data-react');
      void this.#el.offsetWidth;  // restarts the CSS animations when the same reaction repeats
      this.#el.dataset.react = name;
      this.#apply(cfg);
      if (say) this.say(say, cfg.ms);
      await wait(cfg.ms);
      this.#el.removeAttribute('data-react');
      this.#reacting = null;
      this.#apply(STATES[this.#base]);
    }

    #apply(cfg) {
      const d = this.#el.dataset;
      this.#cfg = cfg;
      d.state = this.#base;
      d.eyes = cfg.eyes;
      d.mouth = cfg.mouth;
      if (cfg.blush) d.blush = ''; else delete d.blush;
      if (!cfg.look && Date.now() < this.#lookUntil) return;  // let a glance from lookAt() finish
      this.#lookUntil = 0;
      this.#setLook(...(cfg.look || [0, 0]));
    }

    #setLook(x, y) {
      this.#el.style.setProperty('--lx', clamp(x).toFixed(2));
      this.#el.style.setProperty('--ly', clamp(y).toFixed(2));
    }

    #blink() {
      if (!BLINKABLE.has(this.#el.dataset.eyes)) return;
      const shut = () => {
        this.#el.classList.add('blink');
        this.#after(110, () => this.#el.classList.remove('blink'));
      };
      shut();
      if (Math.random() < .2) this.#after(260, shut);  // occasional double blink
    }

    #fidget() {
      if (this.#reacting || Date.now() < this.#lookUntil) return;
      if (this.#base === 'idle' || this.#base === 'music') this.look(rand(-1, 1), rand(-.6, .5), rand(700, 1800));
      else if (this.#base === 'laptop') this.look(rand(-.3, .3), -.1, rand(900, 1600));  // glance up at the room
    }

    /** Attract mode: a loose routine so Byte stays lively on the projector between events. */
    async #autopilot() {
      const run = ++this.#run;
      const live = () => run === this.#run && this.isConnected;
      const pick = list => list[Math.floor(Math.random() * list.length)];
      const hold = async ms => { for (const end = Date.now() + ms; live() && Date.now() < end;) await wait(250); };
      const mode = (state, ms) => { this.state = state; return hold(ms); };
      const routine = [
        () => mode('idle', 6000),
        () => this.react('wave'),
        () => mode('music', 9000),
        () => this.react(pick(['dance', 'spin'])),
        () => mode('laptop', 9000),
        () => this.react('think'),
        () => hold(5000),
        () => this.react(pick(['cheer', 'shock', 'glitch'])),
        () => hold(4000),
        () => this.react('yawn'),
        () => mode('sleep', 10000),
        () => { this.state = 'idle'; return this.react('wake'); },
        () => this.react(pick(['love', 'celebrate', 'hype', 'dizzy'])),
      ];
      while (live()) for (const step of routine) { if (!live()) return; await step(); }
    }

    #after(ms, fn) {
      const t = setTimeout(() => { this.#timers.delete(t); fn(); }, ms);
      this.#timers.add(t);
    }

    #every(min, max, fn) {
      const tick = () => { fn(); this.#after(rand(min, max), tick); };
      this.#after(rand(min, max), tick);
    }
  }

  if (!customElements.get('byte-mascot')) customElements.define('byte-mascot', ByteMascot);
})();
