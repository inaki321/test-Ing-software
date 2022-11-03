import { useEffect, useState, useRef } from "react";
import { AILabWebCam } from "ai-lab";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { Conv2D } from "@tensorflow/tfjs";

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

    //posesName
    const [stand, setStand] = useState('Stand');
    const [curl, setCurl] = useState('Stand');
    const [positionIndex, setpositionIndex] = useState(0);
    const [positionIndex2, setpositionIndex2] = useState(0);
    const [standReps, setstandReps] = useState(0);
    const [curlReps, setcurlReps] = useState(0);

    //count 

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
        let res1, res2;
        res1 = 1 + res.keypoints3D[2].y;
        res2 = 1 + res.keypoints3D[5].y;
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
        if (results.keypoints3D[26].score < 0.75) {
            return;
        }

        //poses, left leg, right leg 
        let standingPoses = [[180, 180], [90, 90], [180, 180]]
        let curlPoses = [[180, 180], [90, 90], [180, 180]]

        let rightKneeAngle;
        rightKneeAngle = getAngle(results.keypoints3D[24], results.keypoints3D[26], results.keypoints3D[28]);

        let leftKneeAngle;
        leftKneeAngle = getAngle(results.keypoints3D[23], results.keypoints3D[25], results.keypoints3D[27]);

        let leftElbowAngle;
        leftElbowAngle = getAngle(results.keypoints3D[11], results.keypoints3D[13], results.keypoints3D[15]);

        let rightElbowAngle;
        rightElbowAngle = getAngle(results.keypoints3D[11], results.keypoints3D[13], results.keypoints3D[15]);

        //stand
        if (positionIndex == 3) {
            setpositionIndex(0);
            setstandReps(standReps + 1);
        }

        //curl
        if (positionIndex2 == 3) {
            setpositionIndex2(0);
            setcurlReps(curlReps + 1);
        }
        //knees
        if (((rightKneeAngle <= (standingPoses[positionIndex][0] + 35) && rightKneeAngle >= (standingPoses[positionIndex][0] - 35)) ||
            (leftKneeAngle <= (standingPoses[positionIndex][1] + 35) && leftKneeAngle >= (standingPoses[positionIndex][1] - 35)))
        ) {
            setpositionIndex(positionIndex + 1);
        }

        //elbows
        if (((rightElbowAngle <= (curlPoses[positionIndex2][0] + 35) && rightElbowAngle >= (curlPoses[positionIndex2][0] - 35)) ||
            (leftElbowAngle <= (curlPoses[positionIndex2][1] + 35) && leftElbowAngle >= (curlPoses[positionIndex2][1] - 35)))
        ) {
            setpositionIndex2(positionIndex2 + 1);
        }
        console.log('pose ', curlPoses[positionIndex2])
        console.log('index ', positionIndex2)
        console.log('reps ', curlReps)
        console.log('-------------')



    }

    function getAngle(vector1, vector2, vector3) {
        let angle = 0;

        let x1 = vector1.x, y1 = vector1.y, z1 = vector1.z;
        let x2 = vector2.x, y2 = vector2.y, z2 = vector2.z;
        let x3 = vector3.x, y3 = vector3.y, z3 = vector3.z;
        //center x 
        x1 = x1 - x2;
        x3 = x3 - x2;
        //center y
        y1 = y1 - y2;
        y3 = y3 - y2;
        //center z
        z1 = z1 - z2;
        z3 = z3 - z2;

        angle = Math.acos((x1 * x3 + y1 * y3 + z1 * z3) / (Math.sqrt((Math.pow(x1, 2) + Math.pow(y1, 2) + Math.pow(z1, 2))) * Math.sqrt(Math.pow(x3, 2) + Math.pow(y3, 2) + Math.pow(z3, 2))))
        angle = (angle * (180 / Math.PI));
        return angle;
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
            <h2>Standing Reps: {standReps}</h2>
            <h2>Curl Reps: {curlReps}</h2>
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