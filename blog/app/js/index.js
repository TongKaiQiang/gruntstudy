window.onload = function(){
    document.getElementById('submit').onclick = function(){
        document.getElementById('answer').value =
            add(parseInt(document.getElementById('num1').value),
                parseInt(document.getElementById('num2').value));
    };
}
