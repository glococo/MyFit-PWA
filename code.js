'use strict'

const  $= _=> document.querySelector(_)
const $$= _=> document.querySelectorAll(_)
const log  = (...v)  => console.log( ...v )

var devScan, miUser={}, drawn={ weight:false, composition:false }
var users = { guillermo:{ name:'Guillermo', sex:"Male", age:40, height:184, impedance:null, weight:null } }

// Do a console test: run-> getCompositionNew( users.__yourdata__ )
// getCompositionNew( users.guillermo )

window.addEventListener('DOMContentLoaded', init )

function addEventListeners(){
  $('#profile-selector').addEventListener('change', e=>onSelectProfile(e.target.value) )
  $('#profile a').addEventListener('click', e=>submitProfile() )
  $('#profile a.is-warning').addEventListener('click', _=>showGlobal('#intro') )
  $('#profile a.is-danger').addEventListener('click', _=>showGlobal('#intro') )
}
function createNewProfile(){
  showGlobal('#profile')
  $('#profile [type=text]').value=''
  $('#profile a.is-warning').classList.add('is-hidden')
}
function onSelectProfile( value ){
    if( value == 'Select profile' || !value ) return
    if( value == '. . . create new profile' ) return createNewProfile()
    launchScale( value )
}
function populateProfileSelector( profiles ) {
    let opt= document.createElement('option')
    opt.text= 'Select profile'
    $('#profile-selector').length=0
    $('#profile-selector').add(opt)
    profiles.forEach( profile=> {
        let opt= document.createElement('option')
        opt.text= profile.name
        $('#profile-selector').add(opt)
    })
    opt= document.createElement('option')
    opt.text= '. . . create new profile'
    $('#profile-selector').add(opt)
}

const noBleSupport= _=>{ $('.gInit').innerHTML=`Sorry.<br>Your browser do not support requestLEScan API.<br>Check your browser flags.`; showGlobal('.gInit') }
const noBleAdapter= _=>{ $('.gInit').innerHTML=`Sorry.<br>There seems to be no Bt LE adapter, you dont have BT or Location enabled or denied access to Web API.`; showGlobal('.gInit') }

function drawWeight(weight){
  if( drawn.weight ) return
  $('.gWeight').innerHTML=`${weight} <div>kg</div>`
}
function drawComposition( miUser ) {
  if( drawn.composition ) return
  drawn.composition= true
  let inner= ''
  miUser.composition.forEach( data=> inner+= `<div> ${data.short} <br> ${data.value} ${data.unit?data.unit:''} </div>` )
  $('.gResults').innerHTML= inner
  $('.gResults').style.display= 'grid'
  log( `Peso: ${miUser.weight}, Impedance: ${miUser.impedance}, Date: ${miUser.date}, Composition: `, miUser.composition )
}
function showGlobal( theClass ) {
  $$('.global').forEach( e=> e.classList.add('is-hidden') )
  $( theClass ).classList.remove('is-hidden')
}
function init() {
  addEventListeners()
  let profiles=[ {name: "Guillermo", sex: "Male", age: 40, height: 184}, {name: "Cecilia", sex: "Female", age: 34, height: 155}, {name: "Vainillo", sex: "Male", age: 24, height: 145} ]
  populateProfileSelector( profiles )
  showGlobal( '#sense' )
  if( !navigator.bluetooth || !navigator.bluetooth.requestLEScan )  return noBleSupport()
  navigator.bluetooth.addEventListener('advertisementreceived', e=> mibcsEvent(e) )
}
function launchBLEScan(){
  btScan( users.guillermo )
}

function btScan(user) {
  showGlobal( '.gLoading' )
  if( !user || !user.sex || !user.age || !user.height ) return log("no user")
  miUser = user
  devScan = navigator.bluetooth.requestLEScan({ filters:[{name:'MIBCS'}] }).catch( e=> noBleAdapter() )
}

// MIBCS: Mi Body Composite Scale. serviceData[1] byte reference
// [ 7:'Without weight', 6:'Invalid Date', 5:'Got Weight', 4:'Jin Unit', 3:'unknown', 2:'unknown', 1:'Got Composition', 0:'unknown' ]
// ServiceData sample: [2, 164, 228, 7, 2, 14, 11, 0, 55, 253, 255, 40, 20]
function mibcsEvent( event ){
    if( event.name!='MIBCS' ) return
    let sData  = new Uint8Array( event.serviceData.get('0000181b-0000-1000-8000-00805f9b34fb').buffer )
    if( sData[1]&0x80 ) return
    showGlobal( '.gWeight' )
    let date   = ((sData[3]<<8)+sData[2]) +"-"+ sData[4] +"-"+ sData[5] +" "+ sData[6] +":"+ sData[7] +":"+ sData[8]
    let weight = ( (sData[12]<<8) + sData[11] ) /200
    let impedance = (sData[10]<<8) + sData[9]
    if( !(sData[1]&0x20) )  return drawWeight( weight )
    if( !miUser.weight )  miUser.weight= weight
    if( !miUser.date   )  miUser.date  = date
    drawWeight( weight )
    drawn.weight= true
    if( !(sData[1] & 0x22) || impedance>3000 || !impedance ) return
    if( !miUser.composition) {
      miUser.impedance  = impedance
      miUser.composition= getCompositionNew( miUser )
      drawComposition( miUser )
    }
}

function btStop(){
    navigator.bluetooth.removeEventListener('advertisementreceived', btEvent )
    devScan.stop()
    log('Scan status: '+ scan.active)
}

function getCompositionNew( user ) {
    if( user.weight>200 || user.weight<10 || user.height>220 || user.impedance>3000 )
        return log("Out of boundaries")

    let lbm = ( user.height * 9.058 / 100) * ( user.height / 100)
        lbm += user.weight * 0.32 + 12.226;
        lbm -= user.impedance * 0.0068;
        lbm -= user.age * 0.0542;

    let bmr
    if( user.sex!='Male' ) bmr= 864.6 + user.weight*10.2036 - user.height*0.39336 - user.age*6.204
    if( user.sex=='Male' ) bmr= 877.8 + user.weight*14.9160 - user.height*0.72600 - user.age*8.976
    if( user.sex!='Male' && bmr>2996 ) bmr = 5000
    if( user.sex=='Male' && bmr>2322 ) bmr = 5000

    let bmi = user.weight / ((user.height * user.height) / 10000)

    let boneMass = -( (user.sex=='Male'? 0.18016894 : 0.245691014) - lbm * 0.05158 )
        boneMass += boneMass > 2.2 ? 0.1 : -0.1
    if( user.sex!='Male' && boneMass > 5.1 ) boneMass = 8
    if( user.sex=='Male' && boneMass > 5.2 ) boneMass = 8

    let lbmSub = 0.8
    let coeff  = 1
    if( user.sex!='Male' ) lbmSub = miUser.age <= 49 ? 9.25 : 7.25
    if( user.sex=='Male' && user.weight < 61 ) coeff = 0.98
    if( user.sex!='Male' && user.weight > 60 ) coeff = user.height>160 ? (0.96*1.03) : 0.96
    if( user.sex!='Male' && user.weight < 50 ) coeff = user.height>160 ? (1.02*1.03) : 1.02

    let bodyFat = ( 1 - (((lbm - lbmSub) * coeff) / user.weight) ) * 100
    if( bodyFat > 63 ) bodyFat = 75

    let visceralFat = 0
    if( user.sex=='Male' && user.height < (user.weight*1.6) )
        visceralFat= user.weight*305 / ( 48 -(user.height*0.4 - ( 0.0826*user.height*user.height )) ) - 2.9 + user.age*0.15
    if( user.sex=='Male' && user.height >= (user.weight*1.6) )
        visceralFat= user.age * 0.15 - 5 - (user.height*0.143 - (user.weight * ( 0.765 + user.height * -0.0015 )))

    if( user.sex!='Male' && user.weight > -(13-(user.height*0.5)) )
        visceralFat= user.weight*500/(user.height*1.45 + user.height*0.1158*user.height -120) - 6 + user.age * 0.07
    if( user.sex!='Male' && user.weight <= -(13-(user.height*0.5)) )
        visceralFat= user.age*0.07 - user.age - ( user.height*0.027 - (user.weight * (0.691 + user.height*0.0024*2)) )

    let water = (100 - bodyFat) * 0.7
    water *= water < 50 ? 1.02 : 0.98

    let muscleMass = user.weight - (bodyFat * 0.01 * user.weight - boneMass)
    if( user.sex!='Male' && muscleMass >= 84 ) muscleMass= 120
    if( user.sex=='Male' && muscleMass >= 93.5 ) muscleMass= 120

    let idealWeight = user.sex=='Male'? (user.height-80)*0.7 : (user.height-70)*0.6
    let idealFatMass= (user.weight * (bodyFat/100)) - (user.weight * (getFatPercentageScale(user.sex,user.age,2)/100) )
        idealFatMass= idealFatMass<0 ? 'to_gain' : 'to_lose'

    let proteinPercentage = muscleMass / user.weight * 100 - water

    let bodyType=0, factor=1
    if( bodyFat > getFatPercentageScale(user.sex,user.age,2) ) factor=0
    if( bodyFat < getFatPercentageScale(user.sex,user.age,1) ) factor=2
    if( muscleMass > getMuscleMassScale(user.sex,user.height,1) ) bodyType= factor*3 + 2
    if( muscleMass < getMuscleMassScale(user.sex,user.height,1) ) bodyType= factor*3
    if( !bodyType ) bodyType= factor*3 + 1
    bodyType = ['obese', 'overweight', 'thick-set', 'lack-exerscise', 'balanced', 'balanced-muscular', 'skinny', 'balanced-skinny', 'skinny-muscular'][bodyType]


    // metabolicAge
    let mAgeM= user.height*-0.7471 + user.weight*0.9161 + user.age*0.4184 + user.impedance*0.0517 + 54.2267
    let mAgeF= user.height*-0.7471 + user.weight*0.9161 + user.age*0.4184 + user.impedance*0.0517 + 54.2267
    let metabolicAge = user.sex=='Male' ? mAgeM : mAgeF
    /*
    return { lbm:lbm, bmr:bmr, bmi:bmi, bodyFat:bodyFat, visceralFat:visceralFat, boneMass:boneMass,
             water:water, muscleMass:muscleMass, idealWeight:idealWeight, proteinPercentage:proteinPercentage,
             bodyType:bodyType, metabolicAge:metabolicAge }*/

    let calc= [
      { name:"Lean Body Mass", short:"LBM", value:lbm.toFixed(1), unit:'Kg' },
      { name:"Body Mass Index", short:"BMI", value:bmi.toFixed(1), unit:'' },
      { name:"Basal metabolic rate", short:"BMR", value:bmr.toFixed(0), unit:'Cal' },
      { name:"Body Fat", short:"BodyFat", value:bodyFat.toFixed(1), unit:'%' },
      { name:"Visceral Fat", short:"VisceralFat", value:visceralFat.toFixed(2), unit:'' },
      { name:"Bone Mass", short:"BoneMass", value:boneMass.toFixed(1), unit:'Kg' },
      { name:"Water", short:"Water", value:water.toFixed(1), unit:'%' },
      { name:"Muscle Mass", short:"MuscleMass", value:muscleMass.toFixed(1), unit:'Kg' },
      { name:"Ideal weight", short:"Ideal", value:idealWeight.toFixed(1), unit:'Kg' },
      { name:"Protein Percentage", short:"Protein", value:proteinPercentage.toFixed(1), unit:'%' },
      { name:"Body Type", short:"BodyType", value:bodyType, unit:'' },
      { name:"Metabolic Age", short:"MetabolicAge", value:metabolicAge.toFixed(0), unit:'' }
    ]

  // Wikipedia measurement description
  const add= shortName => calc.find( e => e.short==shortName )
  add('LBM').description = `Lean body mass (LBM), or fat-free mass, is a component of body composition, calculated by subtracting body fat weight from total body weight: total body weight is lean plus fat.`
  add('LBM').link = 'https://en.wikipedia.org/wiki/Lean_body_mass'
  add('BMI').description = `BMI provides a simple numeric measure of a person's thickness or thinness, allowing health professionals to discuss weight problems more objectively with their patients. BMI was designed to be used as a simple means of classifying average sedentary (physically inactive) populations, with an average body composition. For such individuals, the value recommendations as of 2014 are as follows: a BMI from 18.5 up to 25 kg/m2 may indicate optimal weight, a BMI lower than 18.5 suggests the person is underweight, a number from 25 up to 30 may indicate the person is overweight, and a number from 30 upwards suggests the person is obese. Lean male athletes often have a high muscle-to-fat ratio and therefore a BMI that is misleadingly high relative to their body-fat percentage.`
  add('BMI').link = 'https://en.wikipedia.org/wiki/Body_mass_index'
  add('BMR').description = `Metabolism comprises the processes that the body needs to function.Basal metabolic rate is the amount of energy per unit of time that a person needs to keep the body functioning at rest. Some of those processes are breathing, blood circulation, controlling body temperature, cell growth, brain and nerve function, and contraction of muscles. Basal metabolic rate (BMR) affects the rate that a person burns calories and ultimately whether that individual maintains, gains, or loses weight. The basal metabolic rate accounts for about 60 to 75% of the daily calorie expenditure by individuals.`
  add('BMR').link = 'https://en.wikipedia.org/wiki/Basal_metabolic_rate'
  add('Water').description = `Body water is the water content of an animal body that is contained in the tissues, the blood, the bones and elsewhere. The percentages of body water contained in various fluid compartments add up to total body water (TBW)`
  add('Water').link = 'https://en.wikipedia.org/wiki/Body_water'
  add('VisceralFat').description = `Visceral fat or abdominal fat (also known as organ fat or intra-abdominal fat) is located inside the abdominal cavity, packed between the organs (stomach, liver, intestines, kidneys, etc.).`
  add('VisceralFat').link = 'https://en.wikipedia.org/wiki/Abdominal_obesity'
  add('BodyFat').description = `It is actually adipose tissue; its main function is to store energy in the form of lipids, but it cushions and insulates your body, too. Your body stores two types of fat: essential and storage body fat.`
  add('BodyFat').link = 'https://en.wikipedia.org/wiki/Body_fat_percentage'
  add('BoneMass').description = `Bone mass estimates the weight of the bones in your body.`
  add('BoneMass').link = 'https://en.wikipedia.org/wiki/Bone_density'
  add('MuscleMass').description = `The total mass of body skeletal muscle. The body has three types of muscles: skeletal, smooth, and cardiac. Skeletal muscle is under voluntary control (think biceps), smooth muscle contracts autonomously (or without any thought), and cardiac muscle makes up the main tissue of the heart's walls.`
  add('MuscleMass').link = 'https://www.menshealth.com/health/a27242669/what-your-body-composition-metrics-say-about-your-health/'
  add('Ideal').description = `The calculation of ideal body weight is based on what is the optimal BMI in relation to the likelihood of a long life with the least diseases. Recent large studies indicate that the lowest mortality actually occurs at BMI values ​​close to overweight.`
  add('Ideal').link = 'https://www.health-calc.com/body-composition/ideal-body-weight'
  add('Protein').description = 'Proteins are essential nutrients for the human body. They are one of the building blocks of body tissue and can also serve as a fuel source.'
  add('Protein').link = 'https://en.wikipedia.org/wiki/Protein_(nutrient)'
  add('BodyType').description = `The Physique rating assesses muscle and body fat levels. It rates the result as one of nine body types. The Physique rating gives an indication of what type of body you have.`
  add('BodyType').link = 'https://tanita.eu/help-guides/understanding-your-measurements/physique-rating/'
  add('MetabolicAge').description = `Chronological age is one way to gauge your fitness level compared to your peers`
  add('MetabolicAge').link = 'https://www.healthline.com/health/exercise-fitness/metabolic-age'
  return calc
}

function getFatPercentageScale(sex,age,ref){
    // log(sex,age,ref)
    let xiaomi = [
                { min:  0, max: 20, Female: [18, 23, 30, 35], Male: [8, 14, 21, 25]},
                { min: 21, max: 25, Female: [19, 24, 30, 35], Male: [10, 15, 22, 26]},
                { min: 26, max: 30, Female: [20, 25, 31, 36], Male: [11, 16, 21, 27]},
                { min: 31, max: 35, Female: [21, 26, 33, 36], Male: [13, 17, 25, 28]},
                { min: 36, max: 40, Female: [22, 27, 34, 37], Male: [15, 20, 26, 29]},
                { min: 41, max: 45, Female: [23, 28, 35, 38], Male: [16, 22, 27, 30]},
                { min: 46, max: 50, Female: [24, 30, 36, 38], Male: [17, 23, 29, 31]},
                { min: 51, max: 55, Female: [26, 31, 36, 39], Male: [19, 25, 30, 33]},
                { min: 56, max: 120,Female: [27, 32, 37, 40], Male: [21, 26, 31, 34]} ]
    return xiaomi.find( e=> e.min<=age && age<=e.max )[sex][ref]
}
function getMuscleMassScale(sex,height,ref) {
    let xiaomi = [ {min: {Male: 170, Female: 160}, Female: [36.5, 42.6], Male: [49.4, 59.5]},
                   {min: {Male: 160, Female: 150}, Female: [32.9, 37.6], Male: [44.0, 52.5]},
                   {min: {Male:   0, Female:   0}, Female: [29.1, 34.8], Male: [38.5, 46.6]} ]
    return xiaomi.find( e=> e.min[sex]<height )[sex][ref]
}/*
function getBoneMassScale(sex, weight, ref) {
    let xiaomi = [ {Male: {min: 75.0, scale: [2.0, 4.2]}, Female: {min: 60.0, scale: [1.8, 3.9]}},
                   {Male: {min: 60.0, scale: [1.9, 4.1]}, Female: {min: 45.0, scale: [1.5, 3.8]}},
                   {Male: {min:  0.0, scale: [1.6, 3.9]}, Female: {min:  0.0, scale: [1.3, 3.6]}} ]
    return xiaomi.find( e=> e[sex].min<=weight )[sex].scale[ref]
}*/

// Reference sites
// https://github.com/wiecosystem/Bluetooth/blob/master/doc/devices/huami.health.scale2.md
// https://github.com/oliexdev/openScale/wiki/Xiaomi-Bluetooth-Mi-Scale
// https://github.com/oliexdev/openScale/blob/master/android_app/app/src/main/java/com/health/openscale/core/bluetooth/BluetoothMiScale2.java
// https://github.com/oliexdev/openScale/blob/master/android_app/app/src/main/java/com/health/openscale/core/bluetooth/lib/MiScaleLib.java
// https://github.com/Freeyourgadget/Gadgetbridge/blob/master/app/src/main/java/nodomain/freeyourgadget/gadgetbridge/service/devices/miscale2/MiScale2DeviceSupport.java
// https://gist.github.com/sam016/4abe921b5a9ee27f67b3686910293026
