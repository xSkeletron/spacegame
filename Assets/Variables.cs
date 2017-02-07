using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Variables : MonoBehaviour {
    public int redMinerals;
    public int blueMinerals;
    public int greenMinerals;
    public string mineralName;

    // Use this for initialization
    void Start () {
        redMinerals = 0;
        blueMinerals = 0;
        greenMinerals = 0;

    }

    // Update is called once per frame
    /*	void onGUI () {
            GUI.Label(new Rect(10, 10, 100, 20), redMinerals.ToString());
            GUI.Label(new Rect(50, 10, 100, 20), blueMinerals.ToString());
            GUI.Label(new Rect(90, 10, 100, 20), greenMinerals.ToString());

        }
    */

    
}
