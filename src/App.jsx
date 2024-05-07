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
    provizije_skladi: '',
    mesecni_prispevek: ''
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
    provizije_skladi: FieldState.Empty,
    mesecni_prispevek: FieldState.Empty
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

  //da nimas handle_change za vsak field
  function handle_change(event) {
    // vedno ko imaš useRef moraš dat .current, da dobiš vrednost
    // event.target je html element na katerem smo trenutno
    // name pa definiramo sami za vsak input hmtl element in name more bit enak kot kljuc od vrednosti v useRef
    podatki.current[event.target.name] = event.target.value;
    // To lahko kličemo tukaj, ker so vrdnosti polj v useRef in se posodobijo takoj
    validateFieldsColorize();
  }

//----------------------------------------------------------------------
  function formatDecimal(number) {
    const moneyFormatter = new Intl.NumberFormat('sl-SI', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2
    });
    return moneyFormatter.format(number);
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
      const navadnoInvestiranje = navadno_investiranje()
      const skladi = precudoviti_skladi()
      const raz = razlika();
      // Nastavimo state na rezultate
      setNavadnoInvestiranjeResult(formatDecimal(navadnoInvestiranje));
      setSkladiResult(formatDecimal(skladi));
      setRazlikaResult(formatDecimal(raz));
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
    
  <div className='container'>

    <div className="header">
    <h1>Izračun donosa investicij</h1>
    <p>Vzajemni aktivni skladi so scam! Prepricajte se! </p>

    </div>
    
    
    <div>
        <form className='block'>
        
          
        {/*za vsako; zactna investicija, leto, donos, mesecni prispevek... smo naredili to*/ }
      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor="zacetna_investicija">Začetna investicija: </label>
          <input type='text' name='zacetna_investicija' className={fieldState.zacetna_investicija} onChange={ (event) => {handle_change(event)} } required></input>
        </div>
      

        <div className='form-group'>
          <label htmlFor="leta">Koliko let boste držali notri keš? </label>
          {/* ce hocemo samo eno funkcijo klicati on change, damo normalno samo on change in v zavite oklepaje to nunkcijo, ce pa hocemo dve nardimo pa tkole*/}
          <input type='text' name='leta' className={fieldState.leta} onChange={ (event) => {handle_change(event)} } required></input>
        </div>
      </div>




      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor="donos">Donos v %: </label>
          <input type='text' name='donos' className={fieldState.donos} onChange={ (event) => {handle_change(event)} } required></input>
        </div>
      
        <div className='form-group'>
          <label htmlFor="provizije_skladi">Provizije pri skladih: </label>
          <input type='text' name='provizije_skladi' className={fieldState.provizije_skladi} onChange={ (event) => {handle_change(event)} } required></input>
        </div>
      </div> 



      <div className='form-row'>
        <div className='form-group'>
          <label htmlFor="mesecni_prispevek">Mesečni prispevek: </label>
          <input type='text' name='mesecni_prispevek' className={fieldState.mesecni_prispevek} onChange={ (event) => {handle_change(event)} }></input>
        </div>
      </div>

          <button onClick={(e) => pritisnjen_gumb(e)} disabled={!vse_prav} className={vse_prav ? "je" : "ni"}>Izračun</button>
        </form>

        <br></br>
        <br></br>



        {showResult && 
        <section>
        <h1>Donos:</h1>
        <div className='block'>

        <div className='result-row'> 
          <div className='result-box' id='navadno-investiranje'>Navadno investiranje: 
            <div className='result-number'>{navadnoInvestiranjeResult}</div>
          </div>

          

          <div className='result-box' id='skladi'>Precudoviti skladi: 
            <div className='result-number'> {skladiResult}</div>
          </div>

      

          <div className='result-box' id='razlika'>Razlika: 
            <div className='result-number'>{razlikaResult}</div>
          </div>

        </div>
        </div>
        </section>}

          
     </div>

    </div>
  );
}

export default App;

