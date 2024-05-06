import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {

  // Nočemo, da se izračuni spreminjajo ob spremembi vrednosti, zato uporabimo useRef
  // Te vrednosti lahko niso number!
  // useRef je zelo podobno kot navadna spremenljivka, samo da navadna spremenljivka ne ohrani svoje vrednosti, ko se komponenta rerendera
  // useRef ohrani vrednost, ampak njegove spremembe ne sprožijo re-rendera tako kot pri useState
  const podatki = useRef({
    zacetna_investicija: '',
    leta: '',
    donos: '',
    provizije_skladi: ''
  });

  // Pove v kakšnem stanju je polje
  // To je kot neke vrste enum
  const FieldState = {
    Empty: "empty",
    Invalid: "invalid",
    Valid: "valid"
  }

  // Želimo, da se barva inputov posodablja sproti, ko spreminjamo vrednosti, zato uporabimo useState
  const [fieldState, setFieldState] = useState({
    zacetna_investicija: FieldState.Empty,
    leta: FieldState.Empty,
    donos: FieldState.Empty,
    provizije_skladi: FieldState.Empty
  });

  // Tukaj shranimo rezultate izračunov
  const [navadnoInvestiranjeResult, setNavadnoInvestiranjeResult] = useState(null);
  const [skladiResult, setSkladiResult] = useState(null);
  const [razlikaResult, setRazlikaResult] = useState(null);

  const [vse_prav, set_vse_prav] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // Ker pri stanju inputov uporabljamu useState, moramo na spremembe čakati v useEffect
  // Šele ko se vrednosti spremeni, lahko preverimo ali so vsa polja pravilno izpolnjena
  useEffect(() => {
    ali_vse_prav();
  }, [fieldState]);

  function handle_change(event) {
    podatki.current[event.target.name] = event.target.value;
    // To lahko kličemo tukaj, ker so vrdnosti polj v useRef in se posodobijo takoj
    validateFieldsColorize();
  }

//----------------------------------------------------------------------

  //napisat morm tri funkcije:
    //navadno investiranje
    //precudoviti skladi
    //razlika
    //in napisem eno funkcijo ki klice vse te tri
    //in to funkcijo dam da se na klik  buttona izvede 

    function pritisnjen_gumb(event){
      event.preventDefault();
      // Nastavimo state na rezultate
      setNavadnoInvestiranjeResult(navadno_investiranje());
      setSkladiResult(precudoviti_skladi());
      setRazlikaResult(razlika());
      // Prikažemo rezultat
      setShowResult(true);
    }   

//----------------------------------------------------------------------

    function navadno_investiranje() {
      let kes = podatki.current.zacetna_investicija;
      let donos_v_decimalki = (podatki.current.donos / 100) + 1
      for(let i = 0; i < podatki.current.leta; i++) {
        kes = kes * donos_v_decimalki
      }
      kes = kes.toFixed(2);
      return kes;
    }

//---------------------

    function precudoviti_skladi() {
      let kes = podatki.current.zacetna_investicija;
      //donos s katerim bomo mnozili
      //recimo da je 10 ti bo dalo ven 1.1
      let donos_v_decimalki = (podatki.current.donos / 100) + 1
      
      //ce je 2% ti to da ven 0.98
      let minus_provizije = 1 - (podatki.current.provizije_skladi / 100)
      for (let i = 0; i < podatki.current.leta; i++) {
        //recimo da je kesa 10 000 1.1 in 0.98
        // prva iteracija (10 000 * 1.1) * 0.98
        kes = (kes * donos_v_decimalki) * minus_provizije 
      }
      kes = kes.toFixed(2);
      return kes;
    }

//---------------------

    function razlika () {
      //to kar returna funkcija navadno in funkcija skladi tu uporabimo
      // ce je navadno 150 000
      let navadno = navadno_investiranje();
      // ce so skladi 120 000
      let skladi = precudoviti_skladi();
      //more bit to pol 30 000
      let razlikaa = (navadno - skladi).toFixed(2);
      return razlikaa;
    }

    function ali_vse_prav() {
      const prav = Object.keys(fieldState).every((k) => {
        return fieldState[k] === FieldState.Valid
      });

      if (prav) {
        set_vse_prav(true);
      } else {
        set_vse_prav(false);
      }
    }

    // Za vsak input preverimo njegovo vrednost in v skladu s tam nastavimo njegovo stanje
    function validateFieldsColorize() {
      Object.keys(fieldState).forEach((s) => {
        if (podatki.current[s] === '') {
          setFieldState(prev => ({...prev, [s]: FieldState.Empty}));
        } else if (isNaN(podatki.current[s])) {
          setFieldState(prev => ({...prev, [s]: FieldState.Invalid}));
        } else {
          setFieldState(prev => ({...prev, [s]: FieldState.Valid}));
        }
      });
    }
  
//----------------------------------------------------------------------
  return (
    
    <div className='cela_forma'>
        <h1>Investiranje</h1>

        <form className='forma'>
          <label htmlFor="zacetna_investicija">Začetna investicija: </label>
          <input type='text' name='zacetna_investicija' className={fieldState.zacetna_investicija} onChange={ (event) => {handle_change(event)} } required></input>
          
          <br></br>
          <br></br>
          <label htmlFor="leta">Koliko let boste držali notri keš? </label>
          {/* ce hocemo samo eno funkcijo klicati on change, damo normalno samo on change in v zavite oklepaje to nunkcijo, ce pa hocemo dve nardimo pa tkole*/}
          <input type='text' name='leta' className={fieldState.leta} onChange={ (event) => {handle_change(event)} } required></input>
          <br></br>
          <br></br>
          <label htmlFor="donos">Donos v %: </label>
          <input type='text' name='donos' className={fieldState.donos} onChange={ (event) => {handle_change(event)} } required></input>
          <br></br>
          <br></br>
          <label htmlFor="provizije_skladi">Provizije pri skladih: </label>
          <input type='text' name='provizije_skladi' className={fieldState.provizije_skladi} onChange={ (event) => {handle_change(event)} } required></input>
          <br></br>
          <br></br>
          
          <button onClick={(e) => pritisnjen_gumb(e)} disabled={!vse_prav} className={vse_prav ? "je" : "ni"}>Izračun</button>
        </form>

        <br></br>
        <br></br>

        {showResult && <div id='rezultati'>  
          <div>Navadno investiranje: {navadnoInvestiranjeResult}</div>
          <div>Precudoviti skladi: {skladiResult}</div>
          <div>Razlika: {razlikaResult}</div>
        </div>} 

          <br></br>
          <br></br>
    </div>

  );
}

export default App;

//DELA VSE VSE DELA KUL, SAM PROBLEM IMAM Z UNIM KORAKOM K UPDEJTA EN KORAK PREPOZNO :)
// BUREK