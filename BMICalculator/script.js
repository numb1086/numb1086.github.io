// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCPWaGA0COlzc7ImdGvCMnqix6IqGaQokE",
  authDomain: "hexschoolhomework.firebaseapp.com",
  projectId: "hexschoolhomework",
  storageBucket: "hexschoolhomework.appspot.com",
  messagingSenderId: "724977698152",
  appId: "1:724977698152:web:9ab9417880f237bdd202dd"
};

// Number validator for input type
function isNumeric(height,weight) {
  return (!isNaN(height) && !isNaN(weight)); 
}
// Non-empty validator for input data
function isEmpty(height,weight) {
  return !(Boolean(height) && Boolean(weight)); 
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let BMIRef = firebase.database().ref('BMI');
let warning = document.getElementById('warning');
let calculate = document.getElementById('calculate');
let list = document.getElementById('list');

calculate.addEventListener('click',(e) => {
  let height = document.getElementById('height').value;
  let weight = document.getElementById('weight').value;
  if(!isNumeric(height,weight) || isEmpty(height,weight)){ 
    warning.style.display = "block";
    return;
  }else {
    warning.style.display = "none";
  }
  // BMI Calculation
  let BMI = (weight/Math.pow((height/100),2)).toFixed(2);
  let result = "";
  if(BMI < 18.5) result = "過輕";
  else if(BMI >= 18.5 && BMI < 24) result = "理想";
  else if(BMI >= 24 && BMI < 27) result = "過重";
  else if(BMI >= 27 && BMI < 30) result = "輕度肥胖"
  else if(BMI >= 30 && BMI < 35) result = "中度肥胖";
  else if(BMI >= 35) result = "重度肥胖";
  // Store BMI result to firebase
  let date = new Date();
  let today = (date.getMonth() + 1) + '-' + date.getDate() + '-' +  date.getFullYear();
  if(today.length < 10) today = "0" + today;

  BMIRef.push({
    result: result,
    BMI: BMI,
    weight: weight,
    height: height,
    date: today
  });
});

// Show results on browser
BMIRef.on('value',(snapshot) => {
  let obj = snapshot.val();
  let str = '';
  let data = [];
  // data reverse
  for(const key in obj) {
    let tmp = [key, obj[key]];
    data.push(tmp);
  }
  data.reverse();
  // // Show data list
  for(const [key, obj] of data) {
    let type = 'ideal';
    if(obj.result == '過輕') type = 'light';
    else if(obj.result == '過重') type = 'heavy';
    else if(obj.result == '輕度肥胖') type = 'sm-heavy';
    else if(obj.result == '中度肥胖') type = 'md-heavy';
    else if(obj.result == '重度肥胖') type = 'lg-heavy';

    str += `<div class='content' data-key=${key}>
              <div class=${type}></div>
              <div>${obj.result}</div>
              <div><span>BMI</span>${obj.BMI}</div>
              <div><span>weight</span>${obj.weight}kg</div>
              <div><span>height</span>${obj.height}cm</div>
              <div><span>${obj.date}</span></div>
            </div>`
  }
  list.innerHTML = str;
});

// Delete selected item
list.addEventListener('click',(e) => {
  let key = e.target.dataset.key || // div
            e.target.parentNode.dataset.key || // div in div
            e.target.parentNode.parentNode.dataset.key; // span
  if(Boolean(key)) 
    BMIRef.child(key).remove();
});