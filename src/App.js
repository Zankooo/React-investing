import { useEffect, useState } from 'react';
import './App.css';
import React from 'react'

function App() {
  const [zacetna_investicija, set_zacetna_investicija] = useState({kes:'', je_prav: false});
  const [leta, set_leta] = useState({leta:'', je_prav: false});
  const [donos, set_donos] = useState({donoss: '', je_prav: false});
  const [provizije_skladi, set_provizije_skladi] = useState({provizije: '', je_prav:  false});
  const [showResult, setShowResult] = useState(false);

  const [ali_je_vse_prav, set_ali_je_vse_prav] = useState(false)

  const [spremeni_barvo, set_spremeni_barvo] = useState(false); 


  useEffect(() =>{
    console.log("burek");
    console.log(`Zacetna investiicja shranjeva v spremenljivki so: ${zacetna_investicija.kes} `);
    console.log(`Leta v shranjeva  spremenljivki so: ${leta.leta} `);
    console.log(`Donos v spremenljivki so: ${donos.donoss}`);
    console.log(`Provizije skladi shranjene v spremenljivki so: ${provizije_skladi.provizije} `);
    ali_vse_prav();
    console.log(ali_je_vse_prav)
    
  }, [zacetna_investicija, leta, donos, provizije_skladi, ali_je_vse_prav]);


  //okej, zdej znam spreminjat eno lastnost css-ja.
  // v tem primeru background color
  //kako pa spreminjamo lahko vec, tri stiri pet css lastnosti
  //recimo background, color, border, height, width ...
  function handle_gumb_klik(){
    set_spremeni_barvo((prevState) => !prevState);
    
  }

  //djds 
  
  
 
  //vse te funkcije: vzamejo iz vsaka svojega inputa vrednost in jo izpisujejo v konzolo vedno ko se spreminja,
  //hkrati pa tudi shranjujejo vrednost v globalno spremenljivko in tut to izpisujejo, da je zih shranjena vrednost v spremenljivki
  function handle_change_zacetna_investicija(event){
    const input_vrednost_zacetna = event.target.value;
    //preveri ali je input sploh cifra in ce je cifra ce je vecja ali enaka 0 in preveri ce je sploh kej notr napisano
    if(!isNaN(input_vrednost_zacetna) && (input_vrednost_zacetna >= 0) && (input_vrednost_zacetna.trim() !== '') ){
      set_zacetna_investicija({kes:input_vrednost_zacetna, je_prav: true});
      //zgleda da ona je shranjena v variable ampak sam noce jo izpisat. zgleda je tko, tko nekak je ja.
      
    }
    else{
      set_zacetna_investicija({kes:'', je_prav: false});
      
    }
    
  }
  

  //---------------------

  function handle_change_leta(event) {
    const input_vrednost_leta = event.target.value;
    if(!isNaN(input_vrednost_leta) && (input_vrednost_leta >= 1) && (input_vrednost_leta.trim() !== '')){
      
      set_leta({leta: input_vrednost_leta, je_prav: true});
    }
    else{
      set_leta({leta: '', je_prav: false});
      
    }
  };

//---------------------

  function handle_change_donos(event) {
    const input_vrednost_donos = event.target.value;
    if(!isNaN(input_vrednost_donos) && (input_vrednost_donos >= 1) && (input_vrednost_donos.trim() !== '')){
      set_donos({donoss: input_vrednost_donos, je_prav: true});
    }
    else{
      set_donos({donoss: '', je_prav: false});
    }
  };

  

//---------------------

  function handle_change_provizije(event){
    const input_vrednost_provizije = event.target.value;
    if(!isNaN(input_vrednost_provizije) && (input_vrednost_provizije >= 0) && (input_vrednost_provizije.trim() !== '')){
      set_provizije_skladi({provizije: input_vrednost_provizije, je_prav: true})
    }
    else{
      set_provizije_skladi({donoss: '', je_prav: false});
    }
  };

//----------------------------------------------------------------------

  //napisat morm tri funkcije:
    //navadno investiranje
    //precudoviti skladi
    //razlika
    //in napisem eno funkcijo ki klice vse te tri
    //in to funkcijo dam da se na klik  buttona izvede 

    function pritisnjen_gumb(event){
      event.preventDefault();
      //morem vse 4 pogoje pogledat ce so vsa polja pravilno izpoljnena, drugace ne naredim izracuna
      
      if(ali_je_vse_prav === true){
        setShowResult(true);
      
        console.log("-------------------------------------")
        console.log("Gumb je bil pritisnjen")

        navadno_investiranje()
        precudoviti_skladi()
        razlika()
      }
      else{
       console.log("Gumb je bil pritisnjen ampak nismo naredili nicesar ker so polja narobe izpoljnjena") 
      }
    
    }

//----------------------------------------------------------------------

    function navadno_investiranje(){
      let kes = zacetna_investicija.kes;
      let donos_v_decimalki = (donos.donoss / 100) + 1
      for(let i = 0; i < leta.leta; i++){
        kes = kes * donos_v_decimalki

      }
      kes = kes.toFixed(2);
      console.log(`Navadno investiranje: ${kes}`)
      return kes;
    }

//---------------------

    function precudoviti_skladi(){
      let kes = zacetna_investicija.kes
      //donos s katerim bomo mnozili
      //recimo da je 10 ti bo dalo ven 1.1
      let donos_v_decimalki = (donos.donoss / 100) + 1
      
      //ce je 2% ti to da ven 0.98
      let minus_provizije = 1 - (provizije_skladi.provizije/100)
      for(let i = 0; i < leta.leta; i++){
        //recimo da je kesa 10 000 1.1 in 0.98
        // prva iteracija (10 000 * 1.1) * 0.98
        kes = (kes * donos_v_decimalki) * minus_provizije 
      }
      kes = kes.toFixed(2);
      console.log(`Precudoviti skladi: ${kes}`)
      return kes
    }

//---------------------

    function razlika (){
      //to kar returna funkcija navadno in funkcija skladi tu uporabimo
      // ce je navadno 150 000
      let navadno = navadno_investiranje();
      // ce so skladi 120 000
      let skladi = precudoviti_skladi();
      //more bit to pol 30 000
      let razlikaa = (navadno - skladi).toFixed(2);
      //procentualno 
      let procentualno = ((razlikaa / navadno) * 100).toFixed(2);
      console.log(`Procentualno je v bistvu ${procentualno}%, kar je v kešu ${razlikaa}eur`)
      return razlikaa; // 

    }


    function ali_vse_prav(){
      if((zacetna_investicija.je_prav === true) && (leta.je_prav === true) && (donos.je_prav === true) && (provizije_skladi.je_prav === true)){
        set_ali_je_vse_prav(true)
        
      }
      else{
        set_ali_je_vse_prav(false)
      }
    }
  
//----------------------------------------------------------------------
  return (
    
    <div className='cela_forma'>
        <h1>Investiranje</h1>

        <form className='forma'>
          <label htmlFor="zacetna_investicija">Začetna investicija: </label>
          <input type='text' className={zacetna_investicija.je_prav ? 'prava' : 'napacna'} onChange={ (event) => {handle_change_zacetna_investicija(event)} } required></input>
          
          <br></br>
          <br></br>
          <label htmlFor="leta">Koliko let boste držali notri keš? </label>
          {/* ce hocemo samo eno funkcijo klicati on change, damo normalno samo on change in v zavite oklepaje to nunkcijo, ce pa hocemo dve nardimo pa tkole*/}
          <input type='text' className={leta.je_prav ? 'prava' : 'napacna'} onChange={ (event) => {handle_change_leta(event)} } required></input>
          <br></br>
          <br></br>
          <label htmlFor="donos">Donos v %: </label>
          <input type='text' className={donos.je_prav ? 'prava' : 'napacna'} onChange={ (event) => {handle_change_donos(event)} } required></input>
          <br></br>
          <br></br>
          <label htmlFor="provizije">Provizije pri skladih: </label>
          <input type='text' className={provizije_skladi.je_prav ? 'prava' : 'napacna'} onChange={ (event) => {handle_change_provizije(event)} } required></input>
          <br></br>
          <br></br>
          
          <button onClick={pritisnjen_gumb} className={ali_je_vse_prav.valueOf() ? 'je' : 'ni'}>Izračun</button>
        </form>

        <br></br>
        <br></br>

        {showResult && <div id='rezultati'>  
          <div>Navadno investiranje: {navadno_investiranje()}</div>
          <div>Precudoviti skladi: {precudoviti_skladi()}</div>
          <div>Razlika: {razlika()}</div>
        </div>} 

        


          <br></br>
          <br></br>
        <button id='spremeni-barvo' onClick={handle_gumb_klik} className={spremeni_barvo ? 'clicked' : ''} >Spremeni barvo</button>

    </div>

  );
}


export default App;

//DELA VSE VSE DELA KUL, SAM PROBLEM IMAM Z UNIM KORAKOM K UPDEJTA EN KORAK PREPOZNO :)
// BUREK