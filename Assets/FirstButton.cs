using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class FirstButton : MonoBehaviour {
    int value;
    public string mineralName; // 1-3

    void Start()
    {

    }

    void OnGUI()
    {
        if (GUI.Button(new Rect(10, 10, 150, 100), mineralName))
        {
            GameObject variables = GameObject.Find("Main Camera");
            Variables variableScript = variables.GetComponent<Variables>();
            print(variableScript.redMinerals);
        }

    }
}
