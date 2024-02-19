function Smess(x){
    if(x===1){
        document.getElementById('messin').style.display = 'block';
        document.getElementById('messout').style.display = 'none';
    }else{
        document.getElementById('messin').style.display = 'none';
        document.getElementById('messout').style.display = 'block';
    }
}