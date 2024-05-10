import { useEffect, useState, useRef } from 'react';
import Chart from './Chart';
import { formatDecimal } from './util';
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
    mesecni_prispevek: '',
    frekvenca: ''
  });

  let chartDataNavadno = useRef([]);
  let chartDataSkladi = useRef([]);

  let resultRef = useRef(null);

  // Pove v kakšnem stanju je polje
  // To je kot neke vrste enum
  const FieldState = {
    Empty: "empty",
    Invalid: "invalid",
    Valid: "valid"
  }

  const Frekvenca = {
    Anually: "anually",
    Monthly: "monthly"
  }

  // Želimo, da se barva inputov posodablja sproti, ko spreminjamo vrednosti, zato uporabimo useState
  const [fieldState, setFieldState] = useState({
    zacetna_investicija: FieldState.Empty,
    leta: FieldState.Empty,
    donos: FieldState.Empty,
    provizije_skladi: FieldState.Empty,
    mesecni_prispevek:FieldState.Empty
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

      chartDataNavadno.current = [];
      chartDataSkladi.current = [];

      const navadnoInvestiranjeSeq = navadno_investiranje();
      const skladiSeq = precudoviti_skladi();
      const navadnoInvestiranje = navadnoInvestiranjeSeq[navadnoInvestiranjeSeq.length - 1];
      const skladi = skladiSeq[skladiSeq.length - 1];

      chartDataNavadno.current = navadnoInvestiranjeSeq;
      chartDataSkladi.current = skladiSeq;

      const raz = (navadnoInvestiranje - skladi).toFixed(2);

      setNavadnoInvestiranjeResult(navadnoInvestiranje);
      setSkladiResult(skladi);
      setRazlikaResult(raz);

      // Prikažemo rezultat
      setShowResult(true);
      scrollToResult();
    }   

//----------------------------------------------------------------------

    function navadno_investiranje() {
      let out = [];
      let kes = podatki.current.zacetna_investicija;
      let donos_v_decimalki = (podatki.current.donos / 100) + 1;
      if (podatki.current.frekvenca === Frekvenca.Anually) {
        for (let i = 0; i < podatki.current.leta; i++) {
          kes = kes * donos_v_decimalki;
          kes = kes + podatki.current.mesecni_prispevek * 12;
          out.push(parseFloat(kes.toFixed(2)));
        }
      } else {
        donos_v_decimalki = (donos_v_decimalki - 1) / 12 + 1;
        for (let i = 0; i < podatki.current.leta; i++) {
          for (let j = 0; j < 12; j++) { 
            kes = kes * donos_v_decimalki + parseInt(podatki.current.mesecni_prispevek);
          }
          out.push(parseFloat(kes.toFixed(2)));
        }
      }
      return out;
    }

//---------------------

    function precudoviti_skladi() {
      let out = [];
      let kes = podatki.current.zacetna_investicija;
      let donos_v_decimalki = (podatki.current.donos / 100) + 1
      let minus_provizije = 1 - (podatki.current.provizije_skladi / 100)

      if (podatki.current.frekvenca === Frekvenca.Anually) {

        for (let i = 0; i < podatki.current.leta; i++) {
          kes = (kes * donos_v_decimalki) 
          kes = kes + podatki.current.mesecni_prispevek * 12;
          kes = kes * minus_provizije;
          out.push(parseFloat(kes.toFixed(2)));
        }
      } else {
        donos_v_decimalki = (donos_v_decimalki - 1) / 12 + 1;
        for (let i = 0; i < podatki.current.leta; i++) {
          for (let j = 0; j < 12; j++) {
            kes = kes * donos_v_decimalki + parseInt(podatki.current.mesecni_prispevek);
          }
          kes = kes * minus_provizije;
          out.push(parseFloat(kes.toFixed(2)));
        }
      }
      return out;
    }

//---------------------

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

    function addEurLabel(event) {
      // event.target.value = formatDecimal(event.target.value);
    }

    function scrollToResult() {
      if (!resultRef.current) return;
      resultRef.current.scrollIntoView({
        behavior: 'smooth'
      })
    }
  
//----------------------------------------------------------------------
  return (
    <div className='container'>
      <div className="header">
        <h1>Primerjava donosa: Pasivni ETF in Aktivni vzajemni skladi</h1>
      </div>

      <div>
        <form className='block'>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="zacetna_investicija">Začetna investicija {"(€)"}</label>
              <input type='text' name='zacetna_investicija' className={fieldState.zacetna_investicija} onChange={ (event) => {handle_change(event)} } onBlur={(event) => addEurLabel(event)} required></input>
            </div>
            
            <div className="form-group">
              <label htmlFor="leta">Čas investiranja (leta)</label>
              <input type='text' name='leta' className={fieldState.leta} onChange={ (event) => {handle_change(event)} } required></input>
            </div>
          
          {/* ce hocemo samo eno funkcijo klicati on change, damo normalno samo on change in v zavite oklepaje to nunkcijo, ce pa hocemo dve nardimo pa tkole*/}
          
            <div className="form-group">
              <label htmlFor="donos">Letni donos (%)</label>
              <input type='text' name='donos' className={fieldState.donos} onChange={ (event) => {handle_change(event)} } required></input>
            </div>
            <div className="form-group">
              <label htmlFor="provizije_skladi">Letna provizija vzajemnih skladov (%)</label>
              <input type='text' name='provizije_skladi' className={fieldState.provizije_skladi} onChange={ (event) => {handle_change(event)} } required></input>
            </div>
        
            <div className="form-group">
              <label htmlFor="mesecni_prispevek">Mesečni prispevek (€)</label>
              <input type="text" name="mesecni_prispevek" className={fieldState.mesecni_prispevek} onChange={ (event) => {handle_change(event)} } required></input>
            </div>

            <div className="form-group">
              <label htmlFor="frekvenca">Frekvenca obrestovanja: </label>
              <select name="frekvenca" id="frekvenca" onChange={(event) => handle_change(event)}>
                <option value={Frekvenca.Anually}>Letno</option>
                <option value={Frekvenca.Monthly}>Mesečno</option>
              </select>
            </div>
          </div>
        
          <button onClick={(e) => pritisnjen_gumb(e)} disabled={!vse_prav}>Izračun</button>
        </form>
      </div>

      {showResult && 
      <section id='result' ref={resultRef}>
        <h1>Donos</h1>
        <div className='block'>
          <div className='result-row'>
            <div className='result-box' id='navadno-investiranje'>
              <p>Pasivni ETF</p>
              <div className='result-number'>{formatDecimal(navadnoInvestiranjeResult, 2)}</div>
            </div>
            <div className='result-box' id='skladi'>
              <p>Aktivni vzajemni skladi</p>
              <div className='result-number'>{formatDecimal(skladiResult, 2)}</div>
            </div>
            <div className='result-box' id='razlika'>
              <p>Razlika</p>
              <div className='result-number'>{formatDecimal(razlikaResult, 2)}</div>
                <div className='diff-percent'>(-{((parseFloat(razlikaResult) / parseFloat(navadnoInvestiranjeResult))*100).toFixed(2)} %)</div>
              <div className="row">
                
              </div>
            </div>
          </div>
          <Chart chartDataNavadno={chartDataNavadno.current} chartDataSkladi={chartDataSkladi.current}/>
        </div>
      </section>} 
    </div>
    

  );
}

export default App;