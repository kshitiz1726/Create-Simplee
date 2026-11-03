document.getElementById("start").addEventListener("click",async()=>{
  const status=document.getElementById("status");
  status.textContent="";
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab?.id||!/^https?:/.test(tab.url||"")){
      status.textContent="This page cannot be modified. Open a normal website.";
      return;
    }
    await chrome.scripting.executeScript({target:{tabId:tab.id},files:["content.js"]});
    window.close();
  }catch(error){
    status.textContent="Could not open here. Refresh the website and try again.";
    console.error(error);
  }
});

const embeddedButton=document.getElementById("embedded");
const embeddedStatus=document.getElementById("status");
let embeddedState={ready:false,tabId:null,patterns:[],allowed:false};

async function prepareEmbeddedPermission(){
  embeddedStatus.style.color="#85858e";
  embeddedButton.disabled=true;
  embeddedButton.textContent="Checking embedded sections…";
  try{
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    if(!tab?.id||!/^https?:/.test(tab.url||"")){
      embeddedState={ready:true,tabId:null,patterns:[],allowed:false};
      embeddedButton.textContent="Open a website to check embedded pages";
      return;
    }
    const frames=await chrome.scripting.executeScript({
      target:{tabId:tab.id,frameIds:[0]},
      func:()=>[...document.querySelectorAll("iframe,frame")].map(frame=>{
        try{
          const url=new URL(frame.getAttribute("src")||"about:blank",location.href);
          return /^https?:$/.test(url.protocol)&&url.origin!==location.origin?url.origin:null;
        }catch(_){return null;}
      }).filter(Boolean)
    });
    const origins=[...new Set((frames?.[0]?.result||[]))];
    const patterns=origins.map(origin=>`${origin}/*`);
    const allowed=patterns.length?await chrome.permissions.contains({origins:patterns}):false;
    embeddedState={ready:true,tabId:tab.id,patterns,allowed};
    embeddedButton.disabled=!patterns.length||allowed;
    embeddedButton.textContent=!patterns.length?"No external embedded pages found":allowed?"Embedded-page access is enabled":"Include embedded pages on this site";
    if(!patterns.length)embeddedStatus.textContent="Same-site embedded sections are already included.";
    else if(allowed){embeddedStatus.style.color="#b9f36b";embeddedStatus.textContent="Access is enabled for the external pages embedded in this website.";}
  }catch(error){
    embeddedState={ready:false,tabId:null,patterns:[],allowed:false};
    embeddedButton.disabled=false;
    embeddedButton.textContent="Retry embedded-page check";
    embeddedStatus.textContent="Could not check embedded pages. Try reopening the extension popup.";
    console.error(error);
  }
}

// Prepare the exact iframe origins before the permission button is clicked.
// The permission request itself then runs directly inside the user's click gesture.
prepareEmbeddedPermission();

embeddedButton.addEventListener("click",()=>{
  if(!embeddedState.ready){
    prepareEmbeddedPermission();
    return;
  }
  if(!embeddedState.patterns.length){
    embeddedStatus.textContent="No cross-site embedded pages were found. Same-site embedded sections are already included.";
    return;
  }
  if(embeddedState.allowed){
    embeddedStatus.textContent="Embedded-page access is already enabled. Reopen ClickSimple on the page to scan it.";
    return;
  }
  embeddedButton.disabled=true;
  embeddedStatus.textContent="Choose whether to allow access to these embedded sites in Chrome's prompt…";
  chrome.permissions.request({origins:embeddedState.patterns}).then(granted=>{
    embeddedState.allowed=!!granted;
    embeddedButton.disabled=true;
    embeddedButton.textContent=granted?"Embedded-page access is enabled":"Access not granted";
    embeddedStatus.style.color=granted?"#b9f36b":"#ff6b6b";
    embeddedStatus.textContent=granted
      ?"Enabled only for the external sites embedded in this page. Reopen ClickSimple to scan them."
      :"Permission wasn't granted. ClickSimple will keep working on the main page.";
  }).catch(error=>{
    embeddedButton.disabled=false;
    embeddedStatus.style.color="#ff6b6b";
    embeddedStatus.textContent="Chrome couldn't grant embedded-page access. The main-page features are still available.";
    console.error(error);
  });
});
