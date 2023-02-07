import { useEffect, useState } from "react";

function App() {
  const [prompt, setPrompt] = useState(false);
  const [negative_prompt, setNegative_prompt] = useState(false);
  const [strength, setStrength] = useState(0.8);
  const [width, setWidth] = useState("768");
  const [height, setHeight] = useState("768");
  const [num_outputs, setNum_outputs] = useState(1);
  const [url, setUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [IsShow, setIsShow] = useState(false);

  const clickHandle = () => {
    setIsDisabled(true);
    setLoading(true);
    const formData = new FormData();
    formData.append("prompt", prompt);
    formData.append("negative_prompt", negative_prompt);
    formData.append("strength", strength);
    formData.append("width", width);
    formData.append("height", height);
    formData.append("num_outputs", num_outputs);

    fetch(
      "http://localhost/AI_API/AI_stable_diffusion/index.php?action=start",
      {
        method: "post",
        body: formData,
      }
    )
      .then((res) => res.json())
      .then((res) => setUrl(res.url));
  };

  useEffect(() => {
    if (url) {
      const interval = setInterval(function () {
        const formData = new FormData();
        formData.append("url", url);
        fetch(
          "http://localhost/AI_API/AI_stable_diffusion/index.php?action=result",
          {
            method: "post",
            body: formData,
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.status === "processing") {
              setLoading(true);
            }
            if (res.status === "succeeded") {
              setIsDisabled(false);
              setLoading(false);
              setOutput(res.output);
              clearInterval(interval);
            }
          });
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }
  }, [url]);

  return (
    <div
      className="d-flex justify-content-center align-items-center bg-dark"
      style={{ height: "100vh" }}
    >
      {loading && (
        <div
          className="spinner-border text-success position-absolute"
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      )}

      <div
        className="container-fluid "
        style={{ opacity: loading ? 0.3 : 0.9 }}
      >
        <div className="row justify-content-center  rounded">
          <div className="col-md-6">
            <div className="card bg-body shadow-lg">
              <div className="card-header">

                <div className="d-flex justify-content-centers align-items-center">
                  <input
                    className="form-control border-success output-0 shadow-none me-3"
                    type="text"
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Prompt giriniz..."
                  />
                  <button
                    type="button"
                    className="btn btn-success rounded-circle btn-sm border-2 output-0  h-100 w-0"
                    onClick={() => setIsShow(!IsShow)}
                    data-bs-toggle="tooltip" data-bs-placement="top" title="Ekstra Özellikleri Gör"
                  >
                    &#43;
                  </button>

                </div>

                {IsShow && (
                  <>
                    <div className="row border-top mt-3 pt-2 border-success">
                      <div className="col-md-6">
                        <input
                          className="form-control border-2 output-0 shadow-none mt-1"
                          type="text"
                          onChange={(e) => setNegative_prompt(e.target.value)}
                          placeholder="Negative Prompt giriniz..."
                        />
                      </div>
                      <div className="col-md-6 d-flex justify-content-start align-items-center">
                        <label htmlFor="num_outputs">Adet </label>
                        <input
                          className="bg-warning border-2 output-0 shadow-none mt-1 w-75 mx-4"
                          id="num_outputs"
                          value={num_outputs}
                          min="1"
                          max="4"
                          step="1"
                          onChange={(e) => setNum_outputs(e.target.value)}
                          type="range"
                        />
                        <span> {num_outputs}</span>
                      </div>
                    </div>
                    <div className="row ">
                      <div className="col-md-4">
                        <label htmlFor="width">Genişlik Seçin</label>

                        <select
                          className="form-control border-2 output-0 shadow-none mt-1"
                          type="text"
                          value={width}
                          onChange={(e) => setWidth(e.target.value)}
                        >
                          <option value="128">128</option>
                          <option value="256">256</option>
                          <option value="384">384</option>
                          <option value="448">448</option>
                          <option value="512">512</option>
                          <option value="576">576</option>
                          <option value="640">640</option>
                          <option value="704">704</option>
                          <option value="768">768</option>
                          <option value="832">832</option>
                          <option value="896">896</option>
                          <option value="960">960</option>
                          <option value="1024">1024</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="height">Yükseklik Seçin</label>
                        <select
                          className="form-control border-2 output-0 shadow-none mt-1"
                          type="text"
                          id="height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                        >
                          <option value="128">128</option>
                          <option value="256">256</option>
                          <option value="384">384</option>
                          <option value="448">448</option>
                          <option value="512">512</option>
                          <option value="576">576</option>
                          <option value="640">640</option>
                          <option value="704">704</option>
                          <option value="768">768</option>
                          <option value="832">832</option>
                          <option value="896">896</option>
                          <option value="960">960</option>
                          <option value="1024">1024</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label htmlFor="strength">
                          Prompt Strength Giriniz
                        </label>

                        <input
                          className="form-control border-2 output-0 shadow-none mt-1"
                          type="number"
                          id="strength"
                          value={strength}
                          onChange={(e) => setStrength(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <button
                    className="btn btn-success "
                    disabled={!prompt || loading || isDisabled}
                    onClick={clickHandle}
                  >
                    Oluştur
                  </button>

                  <div className="col-md-12 mb-0 my-2">
                    {output && (
                      <div>
                        <img
                          src={output}
                          alt="output_photo"
                          className="rounded w-75"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
