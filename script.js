form = document.querySelector('form');
tbody = document.getElementById('tbody');



const onSubmit = (e) => {
    e.preventDefault();

    word = document.getElementById('word').value;
    tbody.innerHTML = '';

    function addValues(label, text) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${label}</td><td>:</td><td class="text-break w-100">${text}</td>`
        tbody.appendChild(tr);
    }

    function addMedia(label, link) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${label}</td><td>:</td><td><audio src="${link}" controls></audio></td>`
        tbody.appendChild(tr);
    }

    function addHeading(heading) {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td colspan="3"><h5 class="text-capitalize">${heading}</h5></td>`
        tbody.appendChild(tr);
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
            method: 'GET',
        })
        .then(result => {
            return result.json()
        })
        .then(result => {
            if(!result.title){
                result = result.slice(0, 1)
                result.forEach(element => {
                    addValues("Word", element.word)
    
                    if (element.phonetic) {
                        if (typeof (element.phonetic) !== undefined) {
                            addValues("Phonetic", element.phonetic)
                        }
                    }
    
    
                    if (element.phonetics && element.phonetics[0].audio) {
                        // console.log('Working')
                        let audio = element.phonetics[0].audio
                        audio = audio.substring(2, audio.length)
                        audio = "https://" + audio;
                        addMedia("Pronunciation", audio)
                    }
    
                    if (typeof (element.origin) !== undefined && element.origin) {
                        addValues("Origin", element.origin)
                    }
    
                    element.meanings.forEach(meanings => {
                        addHeading(meanings.partOfSpeech)
    
                        definitions = meanings.definitions.slice(0, 1)
                        addValues("Definitions", definitions[0].definition)
    
                        if (typeof (definitions[0].example) !== undefined && definitions[0]
                            .example) {
                            addValues("Example", definitions[0].example)
                        }
                    })
                });

            }else{
                addHeading("No result found")
            }
        })
}

form.addEventListener('submit', onSubmit);