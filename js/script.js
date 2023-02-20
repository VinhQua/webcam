const video = document.querySelector('.video');
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const snapSound = document.querySelector('audio');
const strip = document.querySelector('.strip');
const takePhotoBtn = document.querySelector('.take-photo');
const redFilterBtn = document.querySelector('.red-filter');
const pixelsSplitBtn = document.querySelector('.split');
const imageGreenScreen = document.querySelector('.image-filter');
let filter ='';
const getVideo = function(e){
    navigator.mediaDevices.getUserMedia({video:true,audio:false})
    .then(localMediaStream =>{
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
       // video.addEventListener('loadedmetadata',()=>{
            video.play();//console.log(video.videoWidth,video.videoHeight);
       // })
        
        
    })
    .catch(err =>{
        alert("You have to allow man!!!",err);
        console.log(err);
    })
    
};
getVideo();

const paintToCanvas = function(){
    console.log(filter);
    video.addEventListener('loadedmetadata',()=>{
        
     const width = video.videoWidth;
    const height = video.videoHeight;
    console.log(width,height);
    canvas.width = width;
    canvas.height = height;
    console.log(filter,'asd');
    return setInterval(()=>{
        ctx.drawImage(video,0,0,width,height);
        let pixels = ctx.getImageData(0,0,width,height);
        //console.log(filter);
        if (filter === 'redFilter'){
            pixels = redFilter(pixels);
        } else if (filter === 'split'){
            pixels = pixelsSplit(pixels);
        
        } else if ( filter === 'green screen'){
            pixels = greenScreen(pixels);
        }
        ctx.putImageData(pixels,0,0);
        console.log(filter);
    },16)
    })
};
paintToCanvas();
const takePhoto = function(){
    snapSound.currentTime = 0;
    snapSound.play();
    const data = canvas.toDataURL('images/jpeg');
    const link = document.createElement('a');
    link.setAttribute('download','handsome');
    link.textContent = 'Download';
    link.setAttribute('href',data);
    link.innerHTML = `<img src="${data}" alt="HANDSOME">`
    strip.insertBefore(link,strip.firstChild);
    //console.log(data);
};
takePhotoBtn.addEventListener('click',takePhoto);
const redFilter = function(pixels){
    for (let i=0;i <= pixels.data.length ;i+= 4){
        pixels.data[i] = pixels.data[i] +100; //Red
        pixels.data[i+1] = pixels.data[i+1]-50 ; //Green
        pixels.data[i+2] = pixels.data[i+2]-50; //Blue
    }
    return pixels;
};
const pixelsSplit = function(pixels){
    for (i=0;i <= pixels.data.length ;i+=4){
        pixels.data[i-100] = pixels.data[i];
        pixels.data[i+150] = pixels.data[i+1];
        pixels.data[i-500] = pixels.data[i+2];
    }
    return pixels
};
redFilterBtn.addEventListener('click',()=>{
    filter === 'redFilter'?filter='':filter='redFilter';
    console.log(filter);
}
);
pixelsSplitBtn.addEventListener('click',()=>{
    filter === 'split'?filter='':filter='split';
    
})
const greenScreen = function(pixels){
    const levels = {};
    document.querySelectorAll('.rgb input').forEach(input=> levels[input.id] = input.value);
    //console.log(levels);
    for (let i =0;i <= pixels.data.length;i+= 4){
        let red = pixels.data[i];
        
        let green = pixels.data[i+1];
        let blue = pixels.data[i+2];
        let alpha = pixels.data[i+3];
        console.log(alpha);

        if (red <= levels.redmax && red >= levels.redmin &&
            green <= levels.greenmax && green >= levels.greenmin &&
            blue <= levels.bluemax && blue >= levels.bluemin ){
                pixels.data[i+3]=0;
                console.log('out')
                console.log(pixels.data[i+3])
            }
        return pixels;
    }
    //console.log( levels)
};
imageGreenScreen.addEventListener('input',(e)=>{
    //console.log(e.target);
    if (e.target.matches('input')){
        filter = 'green screen'//? filter='': filter = 'green screen';
    }
})

