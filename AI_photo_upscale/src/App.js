import { useEffect, useState } from "react";

function App() {
  const [image, setImage] = useState(false);
  const [upscale, setUpscale] = useState(2);
  const [fidelity, setFidelity] = useState(0.5);
  const [url, setUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const fileHandle = e => {
    const fileReader = new FileReader()

    fileReader.addEventListener('load', function () {
      setImage(this.result)
    })

    fileReader.readAsDataURL(e.target.files[0]);
  }

  const clickHandle = () => {
    setIsDisabled(true);
    const formData = new FormData()
    formData.append('image', image)
    formData.append('fidelity', fidelity)
    formData.append('upscale', upscale)
    fetch('https://upscale-image-php.000webhostapp.com/upscale_ai.php?action=start', {
      method: 'post',
      body: formData
    })
      .then(res => res.json())
      .then(res => setUrl(res.url))
  }

  useEffect(() => {
    if (url) {
      const interval = setInterval(function () {
        const formData = new FormData()
        formData.append('url', url)
        fetch('https://upscale-image-php.000webhostapp.com/upscale_ai.php?action=result', {
          method: 'post',
          body: formData
        })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'processing') {
              setLoading(true)
            }
            if (res.status === 'succeeded') {
              setIsDisabled(false);
              setLoading(false)
              setOutput(res.output)
              clearInterval(interval);
            }
          })
      }, 1000)
      return () => {
        clearInterval(interval);
      }
    }

  }, [url])

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark" style={{ height: "100vh" }}>

      {loading && (
        <div className="spinner-border text-primary position-absolute" role="status" >
          <span className="sr-only"></span>
        </div>
      )
      }

      <div className="container-fluid " style={{ opacity: loading ? .3 : .9 }}>
        <div className="row justify-content-center align-items-center  rounded">
          <div className="col-md-6">
            <div className="card bg-body shadow-lg">
              <div className="card-header">
                <div className="row text-center">
                  <input className="form-control " type="file" onChange={fileHandle} />
                  <div className="col-md-6 mt-2">
                    <label htmlFor="fidelity" className="mr-4 d-block">Benzerlik Oranı </label>
                    <input type="range" id="fidelity" value={fidelity} min="0" max="1" step="0.01" onChange={e => setFidelity(e.target.value)} />
                    <span className="h5 ms-3">{fidelity}</span>
                  </div>
                  <div className="col-md-6 mt-2">
                    <label htmlFor="upscale" className="mr-4 d-block">Çözünürlük Yükseltme </label>
                    <input type="range" value={upscale} id="upscale" min="2" max="5" step="1" onChange={e => setUpscale(e.target.value)} />
                    <span className="h5 ms-3">{upscale}</span>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-6 border-end border-primary" >
                    {image && (
                      <div>
                        <img src={image} alt="old_photo" className="rounded w-75" />
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    {output && (
                      <div>
                        <img src={output} alt="new_photo" className="rounded w-75" />
                      </div>
                    )}
                  </div>

                </div>
              </div>
              <button className="btn btn-primary" disabled={!image || !fidelity || loading || isDisabled} onClick={clickHandle} >Dönüştür</button>
            </div>
          </div>
        </div>
      </div>


    </div >
  );
}

export default App;
