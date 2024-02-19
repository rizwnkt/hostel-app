function feepage(x){
  if(x===1){
    document.getElementById('paidDiv').style.display = 'block';
    document.getElementById('fees-dueDiv').style.display = 'none';
  }else{
    document.getElementById('fees-dueDiv').style.display = 'block';
    document.getElementById('paidDiv').style.display = 'none';
  }
}