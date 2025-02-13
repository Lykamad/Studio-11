function Slider(){

    var slideIndex = 1;
    var slideCount=1;
    var autoSlideCheck=true;
    var slides = document.getElementsByClassName("mySlides");
    /** Initial onPage load construct and display slides **/
    constructPagination(slideCount);
    showSlides(slideIndex,slideCount);
  
    var timer=setInterval(function(){
    slideIndex++;
    constructPagination(slideCount);
    showSlides(slideIndex,slideCount);
    },3000);
    
    document.getElementById("countSelector").addEventListener("change",function(e){
      clearInterval(timer);
      slideCount=Number(e.target.value);
      constructPagination(slideCount);
      showSlides(slideIndex,slideCount);
      if (autoSlideCheck) {
        timer=setInterval(function(){
          slideIndex++;
          constructPagination(slideCount);
          showSlides(slideIndex,slideCount);
        },3000)
      }
    });
  
    document.getElementById("autoSlideCheck").addEventListener("change",function(e){
      autoSlideCheck=e.target.checked;
      if(e.target.checked){
        timer=setInterval(function(){
          slideIndex++;
          constructPagination(slideCount);
          showSlides(slideIndex,slideCount);
        },3000);
      }else{
        clearInterval(timer);
      }
    })
  
    document.getElementById("prev").addEventListener("click",function(e){
      clearInterval(timer);
      showSlides(slideIndex -=1,slideCount);
      if(autoSlideCheck){
        timer=setInterval(function(){
          showSlides(slideIndex +=1,slideCount);
        },3000)
      }
    });
  
    document.getElementById("next").addEventListener("click",function(e){
      clearInterval(timer);
      showSlides(slideIndex +=1,slideCount);
      if (autoSlideCheck) {
        timer=setInterval(function(){
          showSlides(slideIndex +=1,slideCount);
        },3000);
      }
    });
  
    function constructPagination(slideCount){
  
      document.getElementById("pagination").innerHTML="";
      for (var k = 0; k < Math.ceil(slides.length / slideCount); k++) {
        var dots=document.createElement('span');
        dots.setAttribute('class','dot');
       // dots.setAttribute("onclick",`showSlides(${slideIndex=k+1})`);
        dots.onclick= (function(k) {
          return function() {
             clearInterval(timer);
             showSlides(slideIndex=k+1,slideCount);
             if (autoSlideCheck) {
                timer=setInterval(function(){
                  showSlides(slideIndex +=1,slideCount);
                },3000);
              }
          };
        })(k);
        document.getElementById("pagination").appendChild(dots)
      }
    }
  
    function showSlides(n,slideCount) {
      var i;
      var startIndex=0;
      var dots = document.getElementsByClassName("dot");
      if (n > Math.ceil(slides.length/ slideCount)) {slideIndex = 1}    
      if (n < 1) {slideIndex = Math.ceil(slides.length/ slideCount)}
      for (i = 0; i < slides.length; i++) {
        var width=(100/slideCount)-2;
        slides[i].style.width=width+"%";
        slides[i].style.display = "none";  
      }
      for (i = 0; i < dots.length; i++) {
          dots[i].className = dots[i].className.replace(" active", "");
      }
      if(slideIndex > Math.floor(slides.length /slideCount)){
        startIndex=(slideCount*(slideIndex-1))-(slideCount -(slides.length % slideCount));
      }else{
        startIndex=slideCount*(slideIndex-1);
      }
      
      for(var j=startIndex;j<slideIndex*slideCount && j<slides.length;j++){
          slides[j].style.display = "inline-block";
      }
  
      dots[slideIndex-1].className += " active";
      
    }
  })();