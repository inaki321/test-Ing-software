import { useEffect, useState, useRef } from "react";
import { AILabWebCam } from "ai-lab";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

//conected keypoints of the blazepose
const BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS = [
    [0, 1],
    [0, 4],
    [1, 2],
    [2, 3],
    [3, 7],
    [4, 5],
    [5, 6],
    [6, 8],
    [9, 10],
    [11, 12],
    [11, 13],
    [11, 23],
    [12, 14],
    [14, 16],
    [12, 24],
    [13, 15],
    [15, 17],
    [16, 18],
    [16, 20],
    [15, 17],
    [15, 19],
    [15, 21],
    [16, 22],
    [17, 19],
    [18, 20],
    [23, 25],
    [23, 24],
    [24, 26],
    [25, 27],
    [26, 28],
    [27, 29],
    [28, 30],
    [27, 31],
    [28, 32],
    [29, 31],
    [30, 32],
];

//tensorflow production builds
tf.enableProdMode();

function flash() {
    let a = document.getElementById('flashfade')
    a.style =
        "transition: none; background-color: rgb(40, 150, 52); display: flex; alignItems: center";
}

function fade() {
    const main = document.getElementById("flashfade");
    if (main.style.transition === "none 0s ease 0s") {
        main.style =
            "transition: background-color 100ms ease-out; background-color: #ffffff;display: flex; alignItems: center";
    }
}

//No rerender 
const config = {
    modelType: "pose",
};

function Test() {
    //model detector
    const [detector, setDetector] = useState();
    //canvas ref to draw the skeleton
    const canvasRef = useRef(null);
    //get webcam DOM
    const vid = document.getElementsByTagName("video")[0];
    //turn skeleton on = true, off =false
    const [skeleton, setSkeleton] = useState(false);

    useEffect(() => {
        const blazeModelConfig = poseDetection.SupportedModels.BlazePose;
        poseDetection
            .createDetector(blazeModelConfig, {
                runtime: "tfjs",
                modelType: "full",
            })
            .then((readyDetector) => {
                setDetector(readyDetector);
            });
    }, []);


    function processResults(res) {
        //draw the skeleton on the canvas
        drawSkeleton(res)
        console.log('var ', skeleton)
    }


    function drawSkeleton(results) {
        var canvas = canvasRef;
        const ctx = canvas.current.getContext("2d");
        if (skeleton) {
            canvas.current.width = vid.width;
            canvas.current.height = vid.height;
            for (var j of results.keypoints) {
                const keypoint = j
                const x = keypoint.x;
                const y = keypoint.y;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, 2 * Math.PI);
                ctx.fillStyle = "red";
                ctx.fill();
            }
            //Draw Esqueleton 
            let poseEsqueleto = results.keypoints.map((pose) => {
                return ({ x: pose.x, y: pose.y, z: pose.z, visibility: pose.score })
            })

            BLAZEPOSE_CONNECTED_KEYPOINTS_PAIRS.forEach((keypoints) => {
                //draw segment 
                ctx.beginPath();
                ctx.moveTo(poseEsqueleto[keypoints[0]].x * 1, poseEsqueleto[keypoints[0]].y * 1);
                ctx.lineTo(poseEsqueleto[keypoints[1]].x * 1, poseEsqueleto[keypoints[1]].y * 1);
                ctx.lineWidth = 2;
                ctx.strokeStyle = "red";
                ctx.stroke();
            });
        } else {
            canvas.current.width = "0px";
            canvas.current.height = "0px";
        }

    }

    //set skeleton to true o false tu 
    if (document.getElementById("skeletonCheckbox")) {
        document.getElementById("skeletonCheckbox").addEventListener('change', () => {
            setSkeleton(!skeleton)
        })
    }

    return (
        <div className="App">
            <h1>Movement Test</h1>
            <h2>Turn on Skeleton</h2>
            <input type="checkbox" name="vehicle1" value="Bike" id="skeletonCheckbox" />
            <div>
                {detector && (
                    <AILabWebCam
                        key="poseMoment"
                        alt="pose image"
                        model={detector}
                        modelConfig={config}
                        onInference={processResults}
                        style={{
                            //frame rate checker 
                            position: "absolute",
                            marginLeft: "auto",
                            marginRight: "auto",
                            left: 0,
                            right: 0,
                            textAlign: "center",
                            zindex: 9,
                        }}
                    />
                )
                }
                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        pointerEvents: "none"
                    }}
                />
            </div>
        </div>
    );
}

export default Test;