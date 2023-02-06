const synth = window.speechSynthesis;

let voices = [];
let lastText = "";

function getSelectedVoice() {
  voices = synth.getVoices();
  // console.log(voices);
  let selectedVoice = voices.find((voice) => {
    return voice.name === "Google UK English Male";
  });
  if (!selectedVoice) {
    selectedVoice = voices.find((voice) => {
      return voice.lang === "en-US";
    });
  }
  return selectedVoice;
}

// export function speak(text) {
//   if (synth.speaking) {
//     console.error("Already speaking");
//     return;
//   }

//   if (text) {
//     synth.cancel();
//     // Get speak text
//     const speakText = new SpeechSynthesisUtterance(text);
//     // Speak end
//     speakText.onend = function (e) {
//       console.log("done speaking ", e);
//     };
//     // Speak error
//     speakText.onerror = function (e) {
//       console.error("Something went wrong!");
//     };

//     // Selected voice
//     const selectedVoice = getSelectedVoice();

//     // set the speak voice
//     speakText.voice = selectedVoice;

//     // Set pitch and rate
//     speakText.rate = 0.95;
//     speakText.pitch = 1;

//     // Speak
//     synth.speak(speakText);
//     var r = setInterval(function () {
//       console.log(synth.speaking);
//       if (!synth.speaking) clearInterval(r);
//       else synth.resume();
//     }, 14000);
//   }
// }

var speechUtteranceChunker = function (utt, settings, callback) {
  settings = settings || {};
  var newUtt;
  var txt = settings && settings.offset !== undefined ? utt.text.substring(settings.offset) : utt.text;
  if (utt.voice && utt.voice.voiceURI === "native") {
    // Not part of the spec
    newUtt = utt;
    newUtt.text = txt;
    newUtt.addEventListener("end", function () {
      if (speechUtteranceChunker.cancel) {
        speechUtteranceChunker.cancel = false;
      }
      if (callback !== undefined) {
        callback();
      }
    });
  } else {
    var chunkLength = (settings && settings.chunkLength) || 160;
    var pattRegex = new RegExp(
      "^[\\s\\S]{" +
        Math.floor(chunkLength / 2) +
        "," +
        chunkLength +
        "}[.!?,]{1}|^[\\s\\S]{1," +
        chunkLength +
        "}$|^[\\s\\S]{1," +
        chunkLength +
        "} "
    );
    var chunkArr = txt.match(pattRegex);

    if (chunkArr[0] === undefined || chunkArr[0].length <= 2) {
      //call once all text has been spoken...
      if (callback !== undefined) {
        callback();
      }
      return;
    }
    var chunk = chunkArr[0];
    newUtt = new SpeechSynthesisUtterance(chunk);
    newUtt.rate = 1;
    newUtt.pitch = 1;
    newUtt.voice = getSelectedVoice();
    var x;
    for (x in utt) {
      if (utt.hasOwnProperty(x) && x !== "text") {
        newUtt[x] = utt[x];
      }
    }
    newUtt.addEventListener("end", function () {
      if (speechUtteranceChunker.cancel) {
        speechUtteranceChunker.cancel = false;
        return;
      }
      settings.offset = settings.offset || 0;
      settings.offset += chunk.length - 1;
      speechUtteranceChunker(utt, settings, callback);
    });
  }

  if (settings.modifier) {
    settings.modifier(newUtt);
  }
  console.log(newUtt); //IMPORTANT!! Do not remove: Logging the object out fixes some onend firing issues.
  //placing the speak invocation inside a callback fixes ordering and onend issues.
  setTimeout(function () {
    speechSynthesis.speak(newUtt);
  }, 0);
};

//create an utterance as you normally would...

export function speak(text) {
  if (text !== lastText) {
    stop();
    lastText = text;
  } else {
    if (synth.speaking) {
      console.error("Already speaking");
      return;
    }
  }
  var utterance = new SpeechSynthesisUtterance(text);

  //modify it as you normally would
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.voice = getSelectedVoice();

  //pass it into the chunking function to have it played out.
  //you can set the max number of characters by changing the chunkLength property below.
  //a callback function can also be added that will fire once the entire text has been spoken.
  speechUtteranceChunker(
    utterance,
    {
      chunkLength: 120,
    },
    function () {
      //some code to execute when done
      console.log("done");
    }
  );
}

export function stop() {
  synth.cancel();
}
