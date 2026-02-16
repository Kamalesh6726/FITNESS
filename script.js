let targetCalories = 1900;
let manualFoods = [];
let burnedCalories = 0;
let sugarCut = false;

/* ================= FOOD DATABASE ================= */
const foodDatabase = {
pongal:250,
coffee:60,
tea:50,
meals:700,
snacks:200,
parotta:300,
rice:400,
idly:60,
dosa:120,
biriyani:600,
cake:250,
chapathi:80,
soup:150,
friedrice:650,
puff:250
};

/* ================= WEEK MENU ================= */
const weeklyMenu = {

Monday:["pongal","coffee","meals","snacks","tea","parotta"],

Tuesday:["chapathi","tea","meals","puff","tea","rice"],

Wednesday:["idly","soup","biriyani","cake","tea","chapathi"],

Thursday:["dosa","tea","meals","snacks","tea","dosa"],

Friday:["pongal","chapathi","coffee","meals","cake","coffee","friedrice"],

Saturday:[],

Sunday:[]
};

/* ================= WORKOUT DATABASE ================= */
const workoutDatabase = {
pushups:0.5,
chestpress:0.6,
shoulderpress:0.5,
lateralraise:0.4,
squats:0.6,
ropejump:12,
running:10,
walking:4
};

/* ================= INIT ================= */
window.onload = function(){
document.getElementById("todayDate").innerText = new Date().toDateString();
setupDays();
loadStreak();
displayWeightHistory();
loadSugar();
};

/* ================= NAVIGATION ================= */
document.querySelectorAll(".nav-btn").forEach(btn=>{
btn.onclick=function(){
document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
btn.classList.add("active");
document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
document.getElementById(btn.dataset.screen).classList.add("active");
};
});

/* ================= DAY SELECT ================= */
function setupDays(){
let select=document.getElementById("daySelect");
select.innerHTML="";
Object.keys(weeklyMenu).forEach(day=>{
let opt=document.createElement("option");
opt.textContent=day;
select.appendChild(opt);
});
select.onchange=loadDayMenu;
loadDayMenu();
}

function loadDayMenu(){
let day=document.getElementById("daySelect").value;
let container=document.getElementById("foodListContainer");
container.innerHTML="";
manualFoods=[];

if(weeklyMenu[day].length===0){
container.innerHTML=`
<input id="manualFood" placeholder="Food name">
<input id="manualQty" type="number" placeholder="Qty">
<button onclick="addManualFood()">Add</button>`;
}else{
weeklyMenu[day].forEach(food=>{
manualFoods.push({name:food,qty:1});
});
renderFoods();
}
calculateTotal();
}

function renderFoods(){
let container=document.getElementById("foodListContainer");
container.innerHTML="";
manualFoods.forEach((item,i)=>{
container.innerHTML+=`
<div style="margin-bottom:8px;">
<b>${item.name}</b>
<input type="number" value="${item.qty}" min="0"
onchange="updateQty(${i},this.value)">
</div>`;
});
}

function updateQty(i,val){
manualFoods[i].qty=parseInt(val)||0;
calculateTotal();
}

function addManualFood(){
let name=document.getElementById("manualFood").value.toLowerCase();
let qty=parseInt(document.getElementById("manualQty").value);
if(!foodDatabase[name]) return alert("Food not found in database");
manualFoods.push({name:name,qty:qty});
renderFoods();
calculateTotal();
}

/* ================= CALORIE CALC ================= */
function calculateTotal(){
let total=0;
manualFoods.forEach(f=>{
if(foodDatabase[f.name])
total+=foodDatabase[f.name]*f.qty;
});
total-=burnedCalories;
if(total<0) total=0;

document.getElementById("totalCalories").innerText=total;
updateCircle(total);
updateStreak(total);
}

function updateCircle(total){
let circle=document.getElementById("progressCircle");
let percent=total/targetCalories;
if(percent>1) percent=1;
let offset=502-(502*percent);
circle.style.strokeDashoffset=offset;
circle.style.stroke=(total>targetCalories)?"red":"green";
}

/* ================= WORKOUT ================= */
document.getElementById("applyWorkoutBtn").onclick=function(){
let type=document.getElementById("workoutType").value;
let sets=parseInt(document.getElementById("workoutSets").value)||0;
let reps=parseInt(document.getElementById("workoutReps").value)||0;

if(!sets||!reps) return alert("Enter sets & reps");

burnedCalories=Math.round(sets*reps*workoutDatabase[type]);

document.getElementById("workoutResult").innerText=
"Burned "+burnedCalories+" kcal 🔥";

calculateTotal();
};

/* ================= BMI ================= */
document.getElementById("calculateBMIBtn").onclick=function(){
let h=document.getElementById("height").value/100;
let w=document.getElementById("weightBMI").value;
if(!h||!w) return alert("Enter height & weight");
let bmi=(w/(h*h)).toFixed(2);
document.getElementById("bmiResult").innerText="BMI: "+bmi;
};

/* ================= STREAK ================= */
function updateStreak(total){
let streak=parseInt(localStorage.getItem("streak"))||0;
if(total<=targetCalories && total>0) streak++;
else if(total>targetCalories) streak=0;
localStorage.setItem("streak",streak);
document.getElementById("streakDisplay").innerText=streak+" Days";
}
function loadStreak(){
let streak=parseInt(localStorage.getItem("streak"))||0;
document.getElementById("streakDisplay").innerText=streak+" Days";
}

/* ================= SUGAR CUT ================= */
document.getElementById("toggleSugarBtn").onclick=function(){
sugarCut=!sugarCut;
localStorage.setItem("sugarCut",sugarCut);
loadSugar();
};

function loadSugar(){
let saved=localStorage.getItem("sugarCut")==="true";
sugarCut=saved;
document.getElementById("sugarStatus").innerText=
sugarCut?"Sugar avoided today: ✅":"Sugar avoided today: ❌";
}

/* ================= WEIGHT TRACKER ================= */
document.getElementById("saveWeightBtn").onclick=function(){
let w=document.getElementById("weeklyWeight").value;
if(!w) return alert("Enter weight");
let history=JSON.parse(localStorage.getItem("weightHistory"))||[];
history.push({date:new Date().toLocaleDateString(),weight:w});
localStorage.setItem("weightHistory",JSON.stringify(history));
displayWeightHistory();
};

function displayWeightHistory(){
let history=JSON.parse(localStorage.getItem("weightHistory"))||[];
let text="";
history.forEach(e=>{
text+=e.date+" - "+e.weight+" kg<br>";
});
document.getElementById("weightHistory").innerHTML=text;
}

/* ================= DARK MODE ================= */
document.getElementById("toggleDarkModeBtn").onclick=function(){
document.body.classList.toggle("dark");
};


