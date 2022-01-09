const toggle = document.getElementById('toggle');
const toggleText = document.getElementById('toggle-text');

function parseTextSelection() {
   window.addEventListener('click', () => {
      const selection = document.getSelection();
      const selectedText = selection.toString();

      if (selectedText.length < 2) return;

      const selectedTextArray = selectedText.split(' ');
      const words = {};

      for (let i = 0; i < selectedTextArray.length; i++) {
         const parsedWord = selectedTextArray[i].replace(/[.,:;!?\n]$/, '').toLowerCase();

         if (parsedWord.match(/[\n]/)) {
            parsedWord.split('\n').forEach((word) => {
               if (!word.length) return;

               if (!words[word]) {
                  words[word] = 1
               } else {
                  words[word] = words[word] + 1
               }
            })
         } else {
            if (!words[parsedWord]) {
               words[parsedWord] = 1
            } else {
               words[parsedWord] = words[parsedWord] + 1
            }
         }
      }

      const output = Object.entries(words)
         .sort((a, b) => b[1] - a[1])
         .reduce((acc, [a, b], index) => {
            if (index === 0) acc = `<h5>Most used words:</h5><hr>`
            if (index < 15) acc += `<b>${a}</b>: ${b.toString()}<br/>`
            if (index === Object.entries(words).length - 1) acc += `<br/><b>Words: </b>${selectedTextArray.length}<br/><b>Characters: </b>${selectedText.length}`
            
            return acc;
         }, '');

      const rangeAt = selection.getRangeAt(0);
      const selectionPosition = rangeAt.getBoundingClientRect();
      
      const paragraph = document.createElement("div");
      paragraph.id = 'most-used-words-output';
      paragraph.innerHTML = output;
      paragraph.style.width = '200px';
      paragraph.style.position = 'fixed';
      paragraph.style.top = window.innerHeight - selectionPosition.bottom < 250 ? selectionPosition.top - 230 + 'px' : selectionPosition.top + 'px';
      paragraph.style.left = selectionPosition.left < 200 ? selectionPosition.right + 15 + 'px' : selectionPosition.left - 215 + 'px';
      paragraph.style.backgroundColor = 'white';
      paragraph.style.padding = '10px';
      paragraph.style.borderRadius = '5px';
      paragraph.style.boxShadow = '1px 4px 15px #555';
      paragraph.style.zIndex = '1000';

      if (!document.getElementById('most-used-words-output')) {
         document.body.appendChild(paragraph);
      }

      document.addEventListener('click', () => {
         document.body.removeChild(paragraph);
      })
  })
}

async function executeScriptInTheTab() {
   let queryOptions = { active: true, currentWindow: true };
   let [tab] = await chrome.tabs.query(queryOptions);
 
   chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: parseTextSelection
   });
}

chrome.storage.sync.get('isActive', async({ isActive }) => {
   if (isActive) {
      toggleText.innerText = 'ON';
      toggle.checked = 'checked';

      executeScriptInTheTab()
   }
 });

toggle.addEventListener('click', async() => {
   if (toggle.checked) {
      toggleText.innerText = 'ON';
      
      executeScriptInTheTab()
      chrome.storage.sync.set({ isActive: true });
   } else {
      toggleText.innerText = 'OFF';
      chrome.storage.sync.set({ isActive: false });

      executeScriptInTheTab()
   }
})


