const inputSlider= document.querySelector("[data-lengthSlider]");
const length = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copybtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator =document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password="";
let passwordlength=10;
handleSlider();
let checkCount=0;
//strength set grey
setIndicator("#ccc");

function handleSlider(){
    inputSlider.value = passwordlength;
    length.innerHTML=passwordlength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = (passwordlength-min)*100/(max-min)+"% 100%";
}

function setIndicator(color)
{
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getRndInteger(min,max)
{
    return Math.floor(Math.random() * (max-min))+min;
}

function generateRandomNumber()
{
    return getRndInteger(0,9);
}

function generateLowecase()
{
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65,91))
}

const symbols = "!@#$%^&*()_+{}|:<>?";


function generateSymbol()
{
    const randnum=getRndInteger(0,symbols.length);
    return symbols.charAt(randnum);
}

function calcstrength()
{
    let hasupper=false;
    let haslower=false;
    let hasnumber=false;
    let hassymbol=false;

    if(uppercaseCheck.checked)
    {
        hasupper=true;
    }
    if(lowercaseCheck.checked)
    {
        haslower=true;
    }
    if(numbersCheck.checked)
    {
        hasnumber=true;
    }
    if(symbolsCheck.checked)
    {
        hassymbol=true;
    }

    if(hasupper && haslower && (hasnumber || hassymbol) && passwordlength>=8 )
    {
        setIndicator("green");
    }
    else if((hasupper || haslower) && (hasnumber || hassymbol) && passwordlength>=6) 
    {
        setIndicator("orange");
    }
    else
    {
        setIndicator("red");
    }
}

async function copyContent()
{   
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerHTML="Copied!";
    }
    catch(err)
    {
        console.log(err);
        copyMsg.innerHTML="Error";
    }
    copyMsg.classList.add("active");
    setTimeout((()=>{copyMsg.classList.remove("active")}),5000);
}

inputSlider.addEventListener("input",(e)=>{
    passwordlength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener("click",(e)=>{
    if(passwordDisplay.value!="")
    {
        copyContent();
    }
});

function handleCheckbox()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        {
            checkCount++;
        }
    });

    if(checkCount>passwordlength)
    {
       passwordlength=checkCount;
       handleSlider();
    }
}

function shuffle(shuffleArray){
    //Fishers-Yates Shuffle
   for(let i=shuffleArray.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const temp=shuffleArray[i];
    shuffleArray[i]=shuffleArray[j];
    shuffleArray[j]=temp;
   }
   let str ="";
   shuffleArray.forEach((el)=>{str+=el;});
   return str;
}


allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener("change",handleCheckbox);
});

generateBtn.addEventListener("click",(e)=>{
    if(checkCount==0)
    {
       return;
    }
    if(passwordlength<checkCount)
    {
        passwordlength=checkCount;
        handleSlider();
    }
    
    password="";
    // if(uppercaseCheck.checked)
    // {
    //     password+=generateUpperCase();
    // }
    // if(lowercaseCheck.checked)
    // {
    //     password+=generateLowecase();
    // }
    // if(symbolsCheck.checked)
    // {
    //     password+=generateSymbol();
    // }
    // if(numbersCheck.checked)
    // {
    //     password+=generateRandomNumber();   
    // }

    let functionArray=[];
    if(uppercaseCheck.checked)
    {
       functionArray.push(generateUpperCase);
    }
    if(lowercaseCheck.checked)
    {
        functionArray.push(generateLowecase);
    }
    if(symbolsCheck.checked)
    {
        functionArray.push(generateSymbol);
    }
    if(numbersCheck.checked)
    {
        functionArray.push(generateRandomNumber);
    }

    for(let i=0;i<functionArray.length;i++)
    {
        password+=functionArray[i]();
    }

    for(let i=0;i<passwordlength-functionArray.length;i++)
    {
        let randnum=getRndInteger(0,functionArray.length);
        password+=functionArray[randnum]();
    }

    password=shuffle(Array.from(password));
    passwordDisplay.value=password;
    calcstrength();
});

