package com.yvdlapp;

import android.os.Bundle; // here
import org.devio.rn.splashscreen.SplashScreen; // here
import com.facebook.react.ReactActivity;
import android.util.Log;
public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "yvdlApp";
  }

  @Override
  protected void onResume(){
    super.onResume();
    Log.d("tag", "onResume event");
  }
  public void onStart()
 {
 super.onStart();
 Log.d("tag", "onStart() event");
 }
 public void onRestart()
 {
 super.onRestart();
 Log.d("tag", "onRestart() event");
 }
 public void onPause()
 {
 super.onPause();
 Log.d("tag", "onPause() event");
 }
 public void onStop()
 {
 super.onStop();
 Log.d("tag", "onStop() event");
 }
 public void onDestroy()
 {
 super.onDestroy();
 Log.d("tag", "onDestroy() event");
 }

//the folowing coed was added by mi to configure the splash screen as the lib suggested
  @Override
    protected void onCreate(Bundle savedInstanceState) {
       Log.d("tag", "onCreate event");
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
    }
}
