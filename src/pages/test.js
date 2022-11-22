import { useEffect, useState, useRef } from "react";
import { AILabWebCam } from "ai-lab";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";
import { Conv2D } from "@tensorflow/tfjs";
import myUser from "../vars";
import { Link } from "react-router-dom";

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

    //count time
    const [startCounter, setstartCounter] = useState(false);
    const [seconds, setseconds] = useState(0);

    //stop trigger sound
    const [soundTrigger, setsoundTrigger] = useState(false);
    const [soundTrigger2, setsoundTrigger2] = useState(false);
    const [soundTrigger3, setsoundTrigger3] = useState(false);

    //set pass variables 
    const [standPass, setstandPass] = useState(false);
    const [curlPass, setcurlPass] = useState(false);

    useEffect(() => {
        if (startCounter) {
            const interval = setInterval(() => setseconds(seconds + 1),
                1000
            );
            return () => clearInterval(interval);
        }
    }, [startCounter, seconds]);

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

    //table results / 2, half of time 
    var user = { name: "Juan", age: 93, sitstandreps: 0, curlreps: 0, sex: "H" }
    user.name = myUser.name;
    user.age = myUser.age;
    user.sex = myUser.sex;
    var menResultsTable = [{ age: "60-64", sitstandrange: 7, curlrange: 8 }, { age: "65-69", sitstandrange: 6, curlrange: 8 }, { age: "70-74", sitstandrange: 6, curlrange: 7 }
        , { age: "75-79", sitstandrange: 6, curlrange: 7 }, { age: "80-84", sitstandrange: 5, curlrange: 7 }, { age: "85-89", sitstandrange: 4, curlrange: 6 },
    { age: "90-94", sitstandrange: 4, curlrange: 5 }]
    var womenResultsTable = [{ age: "60-64", sitstandrange: 6, curlrange: 7 }, { age: "65-69", sitstandrange: 5, curlrange: 7 }, { age: "70-74", sitstandrange: 5, curlrange: 6 }
        , { age: "75-79", sitstandrange: 5, curlrange: 6 }, { age: "80-84", sitstandrange: 4, curlrange: 6 }, { age: "85-89", sitstandrange: 3, curlrange: 5 },
    { age: "90-94", sitstandrange: 3, curlrange: 4 }]

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
                ctx.fillStyle = "green";
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
                ctx.strokeStyle = "green";
                ctx.stroke();
            });
        } else {
            canvas.current.width = "0px";
            canvas.current.height = "0px";
        }


        if (seconds == 15) {
            setsoundTrigger3(true);
            if (soundTrigger3 == false) {
                let sound = new Audio("https://temphal9.s3.us-west-2.amazonaws.com/limber/exercises/137523211.mp3");
                sound.volume = 0.7;
                sound.play();
            }
        }
        //get results
        if (seconds == 30) {
            setstartCounter(false);

            setsoundTrigger2(true);
            if (soundTrigger2 == false) {
                let sound = new Audio("https://temphal9.s3.us-west-2.amazonaws.com/limber/exercises/137523211.mp3");
                sound.volume = 0.7;
                sound.play();
            }

            if (user.sex == "M") {
                for (let i = 0; i < womenResultsTable.length; i++) {
                    const rangeArray = womenResultsTable[i].age.split("-");
                    if (user.age >= parseFloat(rangeArray[0]) && user.age <= parseFloat(rangeArray[1])) {
                        if (womenResultsTable[i].sitstandrange < standReps) {
                            setstandPass(true);
                        }
                        if (womenResultsTable[i].curlrange < curlReps) {
                            setcurlPass(true);
                        }
                        if (curlPass && standPass) {
                            myUser.able = "Yes";
                        }
                    }
                }
            }
            else if (user.sex == "H") {
                for (let i = 0; i < menResultsTable.length; i++) {
                    const rangeArray = menResultsTable[i].age.split("-");
                    if (user.age >= parseFloat(rangeArray[0]) && user.age <= parseFloat(rangeArray[1])) {
                        if (menResultsTable[i].sitstandrange < standReps) {
                            setstandPass(true);
                        }
                        if (menResultsTable[i].curlrange < curlReps) {
                            setcurlPass(true);
                        }
                        if (curlPass && standPass) {
                            myUser.able = "Yes";
                        }
                    }
                }
            }
        }
        console.log(curlPass)
        console.log(standPass)
        console.log(myUser)

        if (results.keypoints3D[26].score < 0.8 && results.keypoints3D[25].score < 0.8) {
            return;
        }

        //poses, left leg, right leg 
        let standingPoses = [[180, 180], [80, 80], [180, 180]]
        let curlPoses = [[180, 180], [80, 80], [180, 180]]

        let rightKneeAngle;
        rightKneeAngle = getAngle(results.keypoints3D[24], results.keypoints3D[26], results.keypoints3D[28]);

        let leftKneeAngle;
        leftKneeAngle = getAngle(results.keypoints3D[23], results.keypoints3D[25], results.keypoints3D[27]);

        let leftElbowAngle;
        leftElbowAngle = getAngle(results.keypoints3D[11], results.keypoints3D[13], results.keypoints3D[15]);

        let rightElbowAngle;
        rightElbowAngle = getAngle(results.keypoints3D[11], results.keypoints3D[13], results.keypoints3D[15]);

        //stand count reps
        if (positionIndex == 3) {
            setpositionIndex(0);
            setstandReps(standReps + 1);
        }

        //curl count reps
        if (positionIndex2 == 3) {
            setpositionIndex2(0);
            setcurlReps(curlReps + 1);
        }

        //if sit, start the test
        if (startCounter == false && ((rightKneeAngle <= (80 + 15) && rightKneeAngle >= (80 - 15)) ||
            (leftKneeAngle <= (80 + 15) && leftKneeAngle >= (80 - 15)))
        ) {
            setsoundTrigger(true);
            setTimeout(function startTimerAfteraSecond() {
                setstartCounter(true);
                if (soundTrigger == false) {
                    let sound = new Audio("https://temphal9.s3.us-west-2.amazonaws.com/limber/exercises/137523211.mp3");
                    sound.volume = 0.7;
                    sound.play();
                }
            }, 1500);
        }

        //knees sitstand
        if (startCounter == true && (seconds >= 0 && seconds <= 15) && ((rightKneeAngle <= (standingPoses[positionIndex][0] + 15) && rightKneeAngle >= (standingPoses[positionIndex][0] - 15)) ||
            (leftKneeAngle <= (standingPoses[positionIndex][1] + 15) && leftKneeAngle >= (standingPoses[positionIndex][1] - 15)))
        ) {
            setpositionIndex(positionIndex + 1);
        }

        //elbows bicepscurls
        if (startCounter == true && (seconds > 15 && seconds <= 30) && (((rightElbowAngle <= (curlPoses[positionIndex2][0] + 30) && rightElbowAngle >= (curlPoses[positionIndex2][0] - 30)) ||
            (leftElbowAngle <= (curlPoses[positionIndex2][1] + 30) && leftElbowAngle >= (curlPoses[positionIndex2][1] - 30)))
            && (leftKneeAngle <= (165 + 15) && leftKneeAngle >= (165 - 25)) &&
            (rightKneeAngle <= (165 + 15) && rightKneeAngle >= (165 - 25)))
        ) {
            setpositionIndex2(positionIndex2 + 1);
        }


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

    //restart the test 
    if (document.getElementById("restarter")) {
        document.getElementById("restarter").addEventListener('click', () => {
            setstandReps(0);
            setcurlReps(0);
            setstartCounter(false);
            setseconds(0);
            setsoundTrigger(false);
            setstandPass(false);
            setcurlPass(false);
        })
    }

    return (
        <div className="App">
            <Link to="/jobs">Go to jobs page</Link>
            <h1>Movement Test</h1>
            <h2>Turn on Skeleton</h2>
            <input type="checkbox" name="vehicle1" value="Bike" id="skeletonCheckbox" />
            <h2>Standing Reps: {standReps}</h2>
            <h2>Curl Reps: {curlReps}</h2>
            <h2>Time: {seconds}</h2>
            <button id="restarter">Restart Test </button>
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