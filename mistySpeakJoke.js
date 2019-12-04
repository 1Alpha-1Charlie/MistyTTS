
misty.ChangeLED(140, 0, 220); //Set LED purple
misty.MoveArms(90, 90, null, null, 2, ""); //Set arms initially down
misty.DisplayImage("e_DefaultContent.jpg", 1); // Default eyes
misty.MoveHeadDegrees(0,0,0,90); //move head straight ahead
misty.Pause(2500); // time for head to get to position


misty.PlayAudio("HearJoke.mp3"); //Misty asks if you want to hear a joke

misty.AddReturnProperty("Bumped", "sensorName");
misty.AddReturnProperty("Bumped", "IsContacted");
misty.RegisterEvent("Bumped", "BumpSensor", 50 ,true);

// Defines how Misty should respond to Bumped event messages. The
// data from each Bumped event is passed into this callback function.
function _Bumped(data) {
    // Assigns the values of sensorPosition and isPressed (the first
    // and second elements in our AdditionalResults array) to variables
    var sensor = data.AdditionalResults[0];
    var isPressed = data.AdditionalResults[1];

    isPressed ? misty.Debug(sensor+" is Pressed") : misty.Debug(sensor+" is Released");

    // Only using front bump sensors
    if (isPressed) {
        if (sensor == "Bump_FrontRight") {
            misty.SendExternalRequest("GET", "https://official-joke-api.appspot.com/random_joke"); // Get joke
        }
        else if (sensor == "Bump_FrontLeft") {
            misty.SendExternalRequest("GET", "https://official-joke-api.appspot.com/random_joke"); // Get Joke
        }
        else {
            misty.Debug("Sensor Name Unknown");
        }
    }
};

function _SendExternalRequest(data) {

    //Parse Data from API call
    _data = JSON.parse(data.Result.ResponseObject.Data);
    
    //put the joke setup in an setup variable
    _jokeSetup = _data.setup 

    //put the joke punchline in an punchline variable
    _jokePunchline = _data.punchline
    
    // combine into one line. TextType: "ssml"
    _entireJoke = `<speak><prosody rate="90%"> ${_jokeSetup}, ${_jokePunchline}</prosody></speak>`;

    var myText = {
        'text' : _entireJoke,
        'voice': 'Ivy'
    };
    
    misty.SendExternalRequest("POST", "https://<your_url>.execute-api.<your_region>.amazonaws.com/dev/speak",null,null,JSON.stringify(myText), false, false, null, null, "_awsGetSound");

}

function _awsGetSound(data) {
    //Parse Data from API call
    _data = JSON.parse(data.Result.ResponseObject.Data);
    _testinput = _data.say;
    misty.SaveAudio("Misty_tts.mp3", _testinput, true, true);
    misty.RegisterEvent("DonePlaying", "AudioPlayComplete", 100, false);
       
};

function _DonePlaying() {
    misty.Pause(1500);
    misty.PlayAudio("AnotherJoke.mp3"); //Misty asks if you want to hear a joke
};
