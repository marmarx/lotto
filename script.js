function sortear(){
  //annonymous function to create an array containing the range of numbers
  let [numQte,min,max,numbersRange] = (function(){    
    let range = [];
    const qte = document.getElementById("qte");
    const inMin = document.getElementById("min");
    const inMax = document.getElementById("max");

    let min = JSON.parse(inMin.value);
    let max = JSON.parse(inMax.value);
    if(min>max){min=max;inMin.value=max}

    inMin.setAttribute('max',max);
    inMax.setAttribute('min',min);
    for(var i=min;i<=max;i++){range.push(i)}

    qte.value = qte.value>range.length?range.length:qte.value;
    let numQte = JSON.parse(qte.value);
    return [numQte,min,max,range];
  })();
  console.log('All available numbers:',numbersRange);

  //function that picks up the numbers randomly
  function randomizeArray(){
    let index = Math.floor(Math.random()*numbersRange.length);
    if(indexes.indexOf(index)==-1){
      indexes.push(index);
      numbers.push(numbersRange[index]);
    }else{randomizeArray()}
  }

  let indexes = [],numbers = [];
  for(var i=0;i<numQte;i++){randomizeArray()}
  numbers.sort((a,b)=>a-b);
  console.log('Selected numbers:',numbers);

  function check(numbers){
    const issues = [];
    let birth=4,sequence=3,five=2,block=3;
    //check if numbers are within the valid range
    if(numbers.some(num=>num<min||num>max)){issues.push(`Alguns números estão fora do intervalo válido (${min}-${max})`)}

    //check if there are duplicate numbers
    const uniqueNumbers = new Set(numbers);
    if(uniqueNumbers.size!==numbers.length){issues.push("Há números duplicados")}

    //check for common birthday bias (numbers from 1 to 31)
    if(max-31>numQte){
      const birthdayBias = numbers.filter(num=>num>=1&&num<=31);
      if(birthdayBias.length>=birth){issues.push(`Há ${birth}+ números relacionados à aniversário (1-31)`)}
    }

    //check for sequential numbers
    let seqCount = 0;
    for(let i=1;i<numbers.length;i++){
      if(numbers[i]-numbers[i-1]===1){seqCount++}else{seqCount=0}
      if(seqCount>=sequence){issues.push(`Há ${sequence}+ números sequenciais`);break}
    }

    //check for multiples of 5 (common in lottery selections)
    const multiplesOfFive = numbers.filter(num=>num%5===0);
    if (multiplesOfFive.length>=five){issues.push(`Há ${five}+ números múltiplos de 5 ou 10 (escolhas comuns)`)}

    //check for numbers in blocks (e.g., 1-5, 6-10, etc)
    const blocks = (function(){
      let arr=[],num=1;
      while(num<max){arr.push([num,num+4]);num+=5}
      return arr;
    })();
    console.log('blocks:',blocks)
    let blockIssue = false;
    blocks.forEach(blk=>{
      if(numbers.filter(num=>num>=blk[0]&&num<=blk[1]).length>block){blockIssue = true}
    });
    if(blockIssue){issues.push(`Há ${block}+ números em blocos comuns (p.ex, 1-5, 6-10, etc)`)}

    //check for a bias towards cultural popular numbers
    let popNumbers=[];
    popNumbers.push(...[7,9,10,11,23,25]);  //soccer and NBA player's jersey
    popNumbers.push(...[3,5,7,13]); //common lucky numbers
    popNumbers.push(...[10,20,30,40,50,60,70,80,90,100]); //round numbers, easy pick
    popNumbers.push(...[7,37,43]); //prime numbers, commonly perceived as strange numbers
    popNumbers.push(...[11,22,33,44,55]); //special significance numbers: good luck, master number, balance, stability
    popNumbers.push(...[77]);  //perfect number
    popNumbers.push(...[42,51]);  //meaning of life, good idea
    popNumbers.push(...[12]); //12 months, 12, hours, 12 zodiac signs
    popNumbers.push(...[31]); //frequently chosen due to birthday influence
    popNumbers.push(...[21]); //lucky number in blackjack and as milestone age in many cultures
    popNumbers.push(...[49]); //square root to 7, a notable pirme number
    popNumbers.push(...[1,3,7,9,13,15,21,25,31,33,37,43,49,51,63,67,69,73,75,79,87,93,99]); //Lucky numbers according to: https://en.wikipedia.org/wiki/Lucky_number
    popNumbers = Array.from(new Set(popNumbers)); //remove duplicates and transform back to an array
    popNumbers.sort((a,b)=>a-b);  //sort numbers

    let pop = popNumbers.filter(num=>numbers.includes(num));
    if(pop.length){issues.push(`Há ${pop.length} números popularmente da <a href="https://en.wikipedia.org/wiki/Lucky_number" target="_blank">sorte</a>: ${pop.join(',')}`)}

    if(issues.length){return issues.length?`<b>Possíveis problemas com este conjunto de números:</b><br><ul><li>${issues.join('</li><li>')}</ul></li>`:''}
    else{return 'Nenhum viés importante detectado. Este é um conjunto de números relativamente equilibrado'}
  }
  
  document.getElementById("consider").innerHTML = check(numbers);
  document.getElementById("myPar").innerHTML = '<b>Números escolhidos aleatoriamente:</b><br><br>'+numbers.join(', ');
  console.log('');
}
document.getElementById("myBtn").onclick = sortear;
function set_min(el){if(el.value<el.getAttribute('min')){el.value=el.getAttribute('min')}}