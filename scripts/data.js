document.addEventListener('DOMContentLoaded', function () {
  var input = document.getElementById('data_avaliacao');
  if (!input) return;
  function onlyDigits(str){ return str.replace(/\D/g,''); }
  function toDDMMYYYYFromDigits(d){
    var dd = d.slice(0,2);
    var mm = d.slice(2,4);
    var yyyy = d.slice(4,8);
    var out = '';
    if(dd){ out += dd; }
    if(mm){ out += (out ? '-' : '') + mm; }
    if(yyyy){ out += (out ? '-' : '') + yyyy; }
    return out;
  }
  function isValidDate(str){
    var m = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if(!m) return false;
    var d = parseInt(m[1],10), mth = parseInt(m[2],10)-1, y = parseInt(m[3],10);
    var dt = new Date(y, mth, d);
    return dt.getFullYear()===y && dt.getMonth()===mth && dt.getDate()===d;
  }
  input.addEventListener('input', function(){
    var digits = onlyDigits(input.value).slice(0,8);
    input.value = toDDMMYYYYFromDigits(digits);
  });
  input.addEventListener('blur', function(){
    if(input.value && !isValidDate(input.value)){
      input.setCustomValidity('Use o formato DD-MM-YYYY com uma data válida.');
    } else {
      input.setCustomValidity('');
    }
  });
  if (!(input.value && input.value.trim() !== '')) {
    var now = new Date();
    var dd = String(now.getDate()).padStart(2, '0');
    var mm = String(now.getMonth() + 1).padStart(2, '0');
    var yyyy = String(now.getFullYear());
    input.value = dd + '-' + mm + '-' + yyyy;
  }
});

