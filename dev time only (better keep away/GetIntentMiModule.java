/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
package mi.rnpackages.rnintentmi;


import android.app.Activity;
import android.content.ComponentName;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;


import androidx.annotation.Nullable;
import com.facebook.fbreact.specs.NativeLinkingSpec;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableType;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.Callback;





/**
 * @see <a href="https://developer.android.com/guide/topics/providers/document-provider.html">android documentation</a>
 */
public class DocumentPickerModule extends ReactContextBaseJavaModule {
	private static final String NAME = "RNGetIntentMI";
	
	
	

	@Override
	public String getName() {
		return NAME;

        
	}

//teporaryworks as the original (targeting VIEW action) for testing purposes

     @ReactMethod
    public void getInitialData(@Nullable Callback failureCallback, @Nullable Callback successCallback) {
        try {
           
           Activity currentActivity = getCurrentActivity();
      String initialURL = null;

      if (currentActivity != null) {
        Intent intent = currentActivity.getIntent();
        String action = intent.getAction();
        Uri uri = intent.getData();

        if (uri != null
            && (Intent.ACTION_VIEW.equals(action)
                || NfcAdapter.ACTION_NDEF_DISCOVERED.equals(action))) {
          initialURL = uri.toString();
        }
      }

            successCallback.invoke(initialURL);
        } 

        catch (Exception e) {
            failureCallback.invoke("ERROR MI:" + e.getMessage());
        }
    }


   
   }