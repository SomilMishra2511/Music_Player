
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

function padZero(value) {
    return (value < 10 ? '0' : '') + value;
}
  
  // Example usage:
  const seconds = 125;
  const formattedTime = formatTime(seconds);
  console.log(formattedTime); // Output: 02:05



async function getsongs(folder){
    currFolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs= []
    for(let index = 0; index < as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
}

 
let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img src="music.svg" alt="">
                            <div class="info">
                                <div class="songname"> ${song.replaceAll("%20", " ")}</div>
                                <div class="songartist">Somil</div>
                            </div>
                            <div><img src="play.svg" alt=""></div>
                        </li>`;
        
    }
 
     Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click", element =>{
            // console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            
        })
     })

     return songs
    }


const playMusic = (track, pause = false)=>{

   currentSong.src = `/${currFolder}/`+ track
   if(!pause){
   currentSong.play()
   play.src = "pause.svg"
   }
   document.querySelector(".songinfo").innerHTML = decodeURI(track)
   document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        if (e.href.includes("./songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/reels/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card">
                            <div class="playbutton">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="35" height="35"
                                    color="#7cd22d" fill="solid green">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5" />
                                    <path
                                        d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                                        fill="currentColor" />
                                </svg>
                            </div>
                            <img src="http://127.0.0.1:5500/songs/reels/cover.jpeg" alt="">
                            <h2>${response.title}</h2>
                            <p>${response.description}</p>
                        </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e)
        e.addEventListener("click", async item => {
            console.log("fetching songs")
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
            
        })
    })

}


async function main(){

      await getsongs("songs/reels")
      playMusic(songs[0],true)


     await displayAlbums()
    
    play.addEventListener("click", () => {
        if (currentSong.paused || currentSong.currentTime <= 0) {
            currentSong.play()
          play.src ="pause.svg"
        }
        else{
            currentSong.pause()
            play.src ="play.svg"
        }
    })
    
    currentSong.addEventListener("timeupdate",() =>{

        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%";
    })


        document.querySelector(".seekbar").addEventListener("click", e=> {
            let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100
            document.querySelector(".circle").style.left = percent + "%"
            currentSong.currentTime = ((currentSong.duration )*percent )/100

        })


        document.querySelector(".hamburger").addEventListener("click", () =>{
            document.querySelector(".left").style.left = 0;
        })


        document.querySelector(".close").addEventListener("click", () =>{
            document.querySelector(".left").style.left= "-100%" ;
        })
    

    document.querySelector(".previous").addEventListener("click", () =>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])       
        if((index-1)>=0)
        playMusic(songs[index-1])
        
    })

    document.querySelector(".next").addEventListener("click", () =>{
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])       
        if((index+1)<songs.length-1)
        playMusic(songs[index+1])

        
    })

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=> {
        console.log(e, e.target, e.target.value)
        currentSong.volume = parseInt(e.target.value)/100
    })

    document.querySelector(".playbutton").addEventListener("click", ()=> {
            if (currentSong.paused || currentSong.currentTime <= 0) {
                currentSong.play()
              play.src ="pause.svg"
            }
    })

    
}
main()

