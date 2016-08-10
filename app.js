(function() {

    'use strict'

    if (!('webkitSpeechRecognition' in window)) {
        alert('Your browser does not support the necessary resources!');
    } else {
        console.info('Lets go!');

        msgInfo.style.display = 'none';
        results.style.display = 'inline-block';
        start_button.style.display = 'inline-block';

        var recognition = new webkitSpeechRecognition();

        var recognizing = false;

        /* The default value for continuous is false, 
            meaning that when the user stops talking, 
            speech recognition will end. */
        recognition.continuous = true;

        /* The default value for interimResults is false, 
            meaning that the only results returned 
            by the recognizer are final and will not change.
            When true, interim results are returned. */
        recognition.interimResults = true;

        recognition.onstart = function(event) {
            console.log('recognition started!');
            recognizing = true;
        }

        recognition.onresult = function(event) {
            console.log('onresult call');

            var interim_transcript = '';

            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_span.innerHTML += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            final_span.innerHTML = capitalize(final_span.innerHTML);
            final_span.innerHTML = linebreak(final_span.innerHTML);
            interim_span.innerHTML = linebreak(interim_transcript);

        }

        recognition.onend = function(event) {
            recognizing = false;
        }

        recognition.onerror = function(event) {
            if (event.error == 'no-speech') {
                console.error('info_no_speech');
            }
            if (event.error == 'audio-capture') {
                console.error('info_no_microphone');
            }
            if (event.error == 'not-allowed') {
                if (event.timeStamp - start_timestamp < 100) {
                    console.error('info_blocked');
                } else {
                    console.error('info_denied');
                }
            }
        }

        start_button.onclick = function(e) {
            console.log('onclick call');
            startButtonAction();
        }

        stop_button.onclick = function(e) {
            console.log('onclick call');
            stopButtonAction();
        }
        
        clear_button.onclick = function(e){
            final_span.innerHTML = '';
        }

        function startButtonAction() {
            console.log('Action call');
            recognition.lang = 'en-US';
            recognition.start();
        }

        function stopButtonAction() {
            if (recognizing) {
                recognition.stop();
                return;
            }
        }

        var first_char = /\S/;
        function capitalize(s) {
            return s.replace(first_char, function(m) { return m.toUpperCase(); });
        }

        var two_line = /\n\n/g;
        var one_line = /\n/g;
        function linebreak(s) {
            return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        }

    }

})();