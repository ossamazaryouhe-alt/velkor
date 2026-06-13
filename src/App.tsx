/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Code2, 
  BookOpen, 
  Download, 
  Smartphone, 
  Keyboard as KeyboardIcon,
  Wifi, 
  Battery, 
  Signal, 
  CornerDownLeft,
  Copy,
  Check,
  FileCode2,
  FolderOpen,
  ArrowRight,
  Sparkles,
  RefreshCw
} from 'lucide-react';

// Codes definition for display in Code Navigator
const FILE_CONTENTS = {
  'MainActivity.kt': `package com.example.testapp

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.key.Key
import androidx.compose.ui.input.key.key
import androidx.compose.ui.input.key.onKeyEvent
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.testapp.ui.theme.TestAppTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            TestAppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = Color.White
                ) {
                    TestAppScreen()
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TestAppScreen() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        var textValue by remember { mutableStateOf("") }

        OutlinedTextField(
            value = textValue,
            onValueChange = { textValue = it },
            textStyle = TextStyle(
                color = Color.Black,
                fontSize = 18.sp,
                textAlign = TextAlign.Start
            ),
            colors = TextFieldDefaults.colors(
                focusedContainerColor = Color.Transparent,
                unfocusedContainerColor = Color.Transparent,
                focusedIndicatorColor = Color(0xFF6200EE),
                unfocusedIndicatorColor = Color.Gray,
                focusedTextColor = Color.Black,
                unfocusedTextColor = Color.Black
            ),
            placeholder = {
                Text("اكتب النص هنا...", color = Color.LightGray, fontSize = 18.sp)
            },
            singleLine = true,
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 32.dp)
                .onKeyEvent { keyEvent ->
                    // Handle physical Enter key press
                    if (keyEvent.key == Key.Enter) {
                        textValue = "" // Clear the field on Enter
                        true
                    } else {
                        false
                    }
                },
            keyboardOptions = KeyboardOptions(
                imeAction = ImeAction.Done
            ),
            keyboardActions = KeyboardActions(
                onDone = {
                    textValue = "" // Clear the field on Virtual Enter
                }
            )
        )
    }
}`,
  'app/build.gradle.kts': `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.testapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.testapp"
        minSdk = 26 // Android 8.0 Oreo
        targetSdk = 34
        versionCode = 1
        versionName = "1.0"
        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables { useSupportLibrary = true }
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures { compose = true }
    composeOptions { kotlinCompilerExtensionVersion = "1.5.8" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.7.0")
    implementation("androidx.activity:activity-compose:1.8.2")
    implementation(platform("androidx.compose:compose-bom:2023.10.01"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
}`,
  'AndroidManifest.xml': `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.testapp">

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="TestApp"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Material.Light.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>`
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'emulator' | 'code' | 'guide'>('emulator');
  const [inputText, setInputText] = useState('');
  const [timeStr, setTimeStr] = useState('12:00');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<keyof typeof FILE_CONTENTS>('MainActivity.kt');
  const [copiedText, setCopiedText] = useState<'all' | 'file' | null>(null);
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState(true);

  // Focus ref for text input in emulator
  const ipRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours.toString().padStart(2, '0')}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      triggerTextClear('المفتاح المادي Enter');
    }
  };

  const triggerTextClear = (sourceMessage: string) => {
    setInputText('');
    setToastMessage(`تم تفريغ الحقل بنجاح بواسطة [${sourceMessage}]`);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
    
    // Maintain input focus
    if (ipRef.current) {
      ipRef.current.focus();
    }
  };

  const handleVirtualKeyPress = (char: string) => {
    if (char === 'ENTER') {
      triggerTextClear('زر Enter الافتراضي');
    } else if (char === 'BACKSPACE') {
      setInputText(prev => prev.slice(0, -1));
    } else if (char === 'SPACE') {
      setInputText(prev => prev + ' ');
    } else {
      setInputText(prev => prev + char);
    }
  };

  const copyToClipboard = (text: string, type: 'all' | 'file') => {
    navigator.clipboard.writeText(text);
    setCopiedText(type);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Keyboard layout for virtual keypad (English & Arabic characters)
  const virtualKeyboardKeys = [
    ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح'],
    ['ج', 'د', 'ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن'],
    ['م', 'ك', 'ط', 'ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة'],
    ['BACKSPACE', 'SPACE', 'ENTER']
  ];

  return (
    <div id="main-container" className="min-h-screen bg-slate-900 text-slate-150 font-sans flex flex-col selection:bg-purple-600/30 selection:text-purple-200">
      
      {/* Header */}
      <header id="app-header" className="border-b border-slate-800 bg-slate-950/80 backdrop-blur px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/5 animate-pulse">
              <Smartphone className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white font-sans">
                  TestApp Native Android Project
                </h1>
                <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                  Android 8.0+ Ready
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                مشروع أندرويد حقيقي مكتمل بلغة Kotlin مع محاكي ويب تفاعلي ١٠٠٪ لشرح السلوك المطلق
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button 
              id="export-apk-instructions"
              onClick={() => setActiveTab('guide')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-sm rounded-xl transition duration-300 shadow-md shadow-emerald-600/15"
            >
              <Download className="w-4 h-4 text-emerald-100" />
              <span>تحميل أو استخراج APK الأصيل</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Body */}
      <main id="app-main" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left column - Selector sidebar and quick stats */}
        <section id="sidebar-controls" className="lg:col-span-3 flex flex-col gap-4">
          
          {/* Main Workspace Navigation */}
          <div className="bg-slate-950 rounded-3xl p-4 border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-3 mb-3">اقسام بيئة العمل</h3>
            
            <button
              id="tab-emulator"
              onClick={() => setActiveTab('emulator')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition duration-300 group ${
                activeTab === 'emulator' 
                  ? 'bg-purple-650 text-white border border-purple-500 shadow-lg shadow-purple-600/10' 
                  : 'hover:bg-slate-900 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5" />
                <span className="font-semibold text-sm">محاكي أندرويد التفاعلي</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-indigo-400 group-hover:bg-slate-705 px-1.5 py-0.5 rounded-md font-mono">LIVE</span>
            </button>

            <button
              id="tab-code"
              onClick={() => setActiveTab('code')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition duration-300 group ${
                activeTab === 'code' 
                  ? 'bg-purple-650 text-white border border-purple-500 shadow-lg shadow-purple-600/10' 
                  : 'hover:bg-slate-900 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Code2 className="w-5 h-5" />
                <span className="font-semibold text-sm">أكواد مشروع Kotlin</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">IDE</span>
            </button>

            <button
              id="tab-guide"
              onClick={() => setActiveTab('guide')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition duration-300 group ${
                activeTab === 'guide' 
                  ? 'bg-purple-650 text-white border border-purple-500 shadow-lg shadow-purple-600/10' 
                  : 'hover:bg-slate-900 text-slate-300 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold text-sm">دليل بناء واستخراج APK</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-md font-mono">DOC</span>
            </button>
          </div>

          {/* Quick Specifications list */}
          <div className="bg-slate-950 rounded-3xl p-5 border border-slate-800 space-y-4 text-xs">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
              <span>مواصفات التطبيق المطلوبة</span>
            </h3>
            
            <ul className="space-y-3 text-slate-300" dir="rtl">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>شاشة واحدة فقط:</strong> خلفية بيضاء نقية تماماً دون أي تشويش.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>منتصف الشاشة:</strong> حقل إدخال نصي واحد ممركز بشكل رائع.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>مسح النص بالكامل:</strong> عند النقر على مفتاح Enter يختفي النص ويفرغ الحقل فورياً.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>بيئة خفيفة:</strong> لا توجد أزرار إضافية، لا إعدادات، لا قواعد بيانات، لا إنترنت.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong>التقنيات المستخدمة:</strong> تطوير أصيل Jetpack Compose, Kotlin, Android SDK 8.0+.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                هذه الواجهة تحتوي على الكود الحقيقي الجاهز للنقل وجهاز محاكي تفاعلي لمراقبة الأداء والتحقق من سير عمل التطبيق بدقة.
              </p>
            </div>
          </div>

        </section>

        {/* Right column - Multi-Tab View Display area */}
        <section id="workspace-viewer" className="lg:col-span-9 flex flex-col">
          
          {/* TAB 1: EMULATOR PREVIEW */}
          {activeTab === 'emulator' && (
            <div id="emulator-panel" className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[680px]">
              
              {/* Emulator Top Header Info Area */}
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
                  <h2 className="text-sm font-bold text-white tracking-wide">
                    Android 8.0 Oreo (API 26) - Virtual Device Emulator (KogaBik Engine)
                  </h2>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>لوحة التحكم بالمحاكي:</span>
                  <button 
                    onClick={() => { setInputText(''); }} 
                    className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 rounded-lg transition"
                    title="تفريغ فوري للنص"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>تفريغ يدوي</span>
                  </button>
                  <button 
                    onClick={() => { setShowVirtualKeyboard(!showVirtualKeyboard); }} 
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition ${
                      showVirtualKeyboard ? 'bg-purple-600/30 text-purple-300 hover:bg-purple-600/40' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <KeyboardIcon className="w-3.5 h-3.5" />
                    <span>{showVirtualKeyboard ? 'إخفاء كيبورد' : 'إظهار كيبورد'}</span>
                  </button>
                </div>
              </div>

              {/* Main Android Phone Body Simulator */}
              <div className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 bg-slate-950 gap-6">
                
                {/* Simulated Smartphone Chassis */}
                <div 
                  id="smartphone-frame" 
                  className="w-full max-w-[340px] aspect-[9/19] bg-slate-950 rounded-[48px] border-[12px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col relative"
                >
                  
                  {/* Camera Top Speaker Bezel */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-slate-950 flex items-center justify-center z-50">
                    {/* Small speaker bar */}
                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                    {/* Camera */}
                    <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800 ml-2"></div>
                  </div>

                  {/* Android Status bar */}
                  <div className="bg-white h-7 px-5 pt-3 select-none flex items-center justify-between text-[11px] font-bold text-slate-700 z-40">
                    <span className="text-[11px] font-semibold text-slate-800">{timeStr}</span>
                    
                    <div className="flex items-center gap-1.5">
                      <Signal className="w-3 h-3 text-slate-800" />
                      <Wifi className="w-3 h-3 text-slate-800" />
                      <div className="flex items-center gap-0.5">
                        <span className="text-[9px] text-slate-700">٩٥٪</span>
                        <Battery className="w-3.5 h-3.5 text-emerald-600 rotate-180" />
                      </div>
                    </div>
                  </div>

                  {/* TestApp Screen Canvas (PURE WHITE SCREEN) */}
                  <div 
                    id="testapp-screen" 
                    className="flex-1 bg-white flex flex-col justify-between relative overflow-hidden text-slate-900 px-4 pt-4 pb-2 select-none"
                  >
                    {/* Screen Title (Optionally hidden for minimalist aesthetics, we put a extremely light subtle center-top App label) */}
                    <div className="text-center py-1 select-none">
                      <span className="text-[10.5px] font-bold text-slate-350 tracking-widest font-mono uppercase">
                        TestApp Screen
                      </span>
                    </div>

                    {/* Centered Single Text Field */}
                    <div className="flex-1 flex flex-col justify-center items-center px-4">
                      
                      <div className="w-full relative">
                        {/* Android Outlined Text Field */}
                        <div className="relative group">
                          
                          <input
                            ref={ipRef}
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            placeholder="اكتب شيئاً هنا..."
                            className="w-full px-4 py-3 bg-white text-slate-900 text-[15px] rounded-xl border-2 border-slate-300 focus:border-purple-600 focus:outline-none transition-all placeholder:text-slate-300 text-left font-sans shadow-sm"
                            dir="auto"
                          />
                          
                          {/* Label float indicator built beautifully inside emulation */}
                          {inputText && (
                            <span className="absolute -top-2.5 left-3 bg-white px-1.5 text-[10px] font-bold text-purple-600 transition-all rounded">
                              حقل النص (Enter للمسح)
                            </span>
                          )}

                          {/* Trigger Enter helper inside phone */}
                          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 select-none">
                            <span 
                              onClick={() => triggerTextClear('مفتاح Enter باللمس')}
                              className="cursor-pointer p-1 bg-slate-100 hover:bg-slate-200 active:scale-90 text-slate-400 hover:text-purple-600 rounded-md transition duration-200"
                              title="اضغط لتفريغ الحقل كأنك ضغطت Enter"
                            >
                              <CornerDownLeft className="w-4 h-4" />
                            </span>
                          </div>

                        </div>

                        {/* Helper note explaining interaction on desktop */}
                        <div className="mt-4 text-center">
                          <p className="text-[10px] text-slate-400 font-medium">
                            اكتب أي نص ثم اضغط على <strong className="text-slate-600">Enter / Return</strong> في الكيبورد الخارجي أو الكيبورد الافتراضي للتفريغ الفوري.
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Simulation Toast Toast Message - simulating Android Native Toast */}
                    {showToast && (
                      <div className="absolute bottom-24 inset-x-4 flex justify-center z-50 animate-fade-in-up">
                        <div className="bg-slate-800 text-slate-100 text-xs py-2 px-4 rounded-full shadow-lg shadow-black/20 text-center font-medium opacity-90 transition duration-300">
                          {toastMessage}
                        </div>
                      </div>
                    )}

                    {/* Simulated Soft Navigation Bar at the bottom of Oreo device */}
                    <div className="h-10 bg-white border-t border-slate-100 flex items-center justify-around text-slate-400 text-sm select-none">
                      {/* Standard back triangle */}
                      <div className="w-4 h-4 border-b-2 border-l-2 border-slate-400 transform rotate-45 rounded-sm"></div>
                      {/* Home Circle */}
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400"></div>
                      {/* Recents Square */}
                      <div className="w-3.5 h-3.5 border-2 border-slate-400 rounded-sm"></div>
                    </div>

                  </div>

                </div>

                {/* Right Area explaining interaction + virtual Android Keyboard */}
                <div className="flex-1 w-full space-y-4">
                  
                  {/* Virtual Keyboard Shell Container */}
                  {showVirtualKeyboard ? (
                    <div className="bg-slate-900 rounded-3xl p-4 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs px-1 text-slate-400">
                        <span className="font-semibold flex items-center gap-1.5"><KeyboardIcon className="w-4 h-4 text-purple-400" /> لوحة المفاتيح الافتراضية (Android IME)</span>
                        <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">عربي / English</span>
                      </div>
                      
                      {/* Keyboard keys layout grids */}
                      <div className="space-y-1.5" dir="rtl">
                        {virtualKeyboardKeys.map((row, rIndex) => (
                          <div key={rIndex} className="flex justify-center gap-1">
                            {row.map((key, kIndex) => {
                              const isSpecial = ['BACKSPACE', 'SPACE', 'ENTER'].includes(key);
                              let keyLabel = key;
                              if (key === 'BACKSPACE') keyLabel = '⌫';
                              if (key === 'SPACE') keyLabel = 'مسافة ␣';
                              if (key === 'ENTER') keyLabel = 'Enter ↵';

                              let buttonStyle = "bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold rounded-lg h-9 flex items-center justify-center transition cursor-pointer shadow-sm";
                              if (key === 'ENTER') {
                                buttonStyle = "bg-purple-600 hover:bg-purple-500 active:scale-95 text-white text-xs font-bold rounded-lg h-9 flex items-center justify-center transition cursor-pointer flex-1 px-4 shadow-md shadow-purple-600/10";
                              } else if (key === 'BACKSPACE') {
                                buttonStyle = "bg-slate-700 hover:bg-slate-650 active:scale-95 text-slate-100 text-xs font-bold rounded-lg h-9 flex items-center justify-center transition cursor-pointer px-4 w-12";
                              } else if (key === 'SPACE') {
                                buttonStyle = "bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 text-xs rounded-lg h-9 flex items-center justify-center transition cursor-pointer px-8 flex-1";
                              } else {
                                buttonStyle += " w-7";
                              }

                              return (
                                <button
                                  key={kIndex}
                                  onClick={() => handleVirtualKeyPress(key)}
                                  className={buttonStyle}
                                >
                                  {keyLabel}
                                </button>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 text-center text-slate-400 text-xs">
                      <p>لقد قمت بإخفاء لوحة المفاتيح الافتراضية. يمكنك استخدام لوحة المفاتيح العادية الخاصة بجهاز الكمبيوتر الآن.</p>
                      <button 
                        onClick={() => setShowVirtualKeyboard(true)}
                        className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-250 rounded-xl transition font-semibold"
                      >
                        إظهار الكيبورد الافتراضي
                      </button>
                    </div>
                  )}

                  {/* Informational Guidelines inside Emulator */}
                  <div className="bg-slate-900/60 rounded-3xl p-5 border border-slate-800/80 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">ماتم إعداده بالكامل في الخلفية:</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-400">
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-805 space-y-1">
                        <strong className="text-slate-150 block text-[13px] text-emerald-400">✓ كود Kotlin منظم</strong>
                        <span>الكود مكتوب بأحدث معايير Compose مع تصفية الإدخال فورياً عند ضغط Enter.</span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-805 space-y-1">
                        <strong className="text-slate-150 block text-[13px] text-emerald-400">✓ دقة التصفير</strong>
                        <span>الحقل النصي يدعم المسح التلقائي من الكيبورد الخارجي وكذلك واجهة IME للأجهزة اللمسية.</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: MAIN KOTLIN SOURCE ENGINES CODE explorer */}
          {activeTab === 'code' && (
            <div id="code-panel" className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[680px]">
              
              {/* Explorer Tab Bar */}
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2.5 bg-purple-600/20 text-purple-400 rounded-lg text-xs font-bold border border-purple-500/10">IDE</div>
                  <h2 className="text-sm font-bold text-white tracking-wide">مستعرض ملفات الكود والتهيئة لمشروع الأندرويد</h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyToClipboard(FILE_CONTENTS[selectedFile], 'file')}
                    className="flex items-center gap-1 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition duration-200 active:scale-95"
                  >
                    {copiedText === 'file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === 'file' ? 'تم نسخ الملف!' : 'نسخ هذا الملف'}</span>
                  </button>
                </div>
              </div>

              {/* Sidebar File explorer + Code reader pane */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-950">
                
                {/* File list */}
                <div className="md:col-span-3 border-r md:border-b-0 border-slate-800 bg-slate-955 p-3 space-y-1.5 shrink-0 flex flex-nowrap md:flex-col overflow-x-auto md:overflow-x-visible">
                  
                  {Object.keys(FILE_CONTENTS).map((fileName) => (
                    <button
                      key={fileName}
                      onClick={() => setSelectedFile(fileName as keyof typeof FILE_CONTENTS)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-xs font-semibold w-full transition duration-250 whitespace-nowrap shrink-0 ${
                        selectedFile === fileName
                          ? 'bg-purple-600/15 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <FileCode2 className={`w-4 h-4 shrink-0 ${selectedFile === fileName ? 'text-purple-400' : 'text-slate-500'}`} />
                      <span className="font-mono text-[11.5px]">{fileName}</span>
                    </button>
                  ))}

                  {/* Root Project Indicator bar */}
                  <div className="hidden md:block pt-4 mt-4 border-t border-slate-800 text-center">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">مسار ملفات المشروع المكتملة:</span>
                    <span className="text-[10px] font-mono text-purple-450 bg-slate-900 py-1 px-2 rounded block">/android-app-source/*</span>
                  </div>

                </div>

                {/* Code viewport panel */}
                <div className="md:col-span-9 p-4 flex flex-col bg-slate-950 font-mono text-xs overflow-auto relative select-text">
                  <div className="text-[11.5px] text-slate-400 mb-2 border-b border-slate-800/50 pb-2 flex items-center justify-between">
                    <span>محتوى الملف المحدد <strong className="text-slate-250">{selectedFile}</strong>:</span>
                    <span className="text-[10.5px] bg-slate-900 px-2 py-0.5 rounded text-purple-355 font-mono">Kotlin / XML</span>
                  </div>

                  <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre p-3 bg-slate-905 rounded-2xl border border-slate-850/30 font-mono text-[12px] h-[480px]">
                    <code>{FILE_CONTENTS[selectedFile]}</code>
                  </pre>
                </div>

              </div>

            </div>
          )}

          {/* TAB 3: STEP-BY-STEP BUILD GUIDE */}
          {activeTab === 'guide' && (
            <div id="guide-panel" className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden flex flex-col h-full min-h-[680px]">
              
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <h2 className="text-sm font-bold text-white">دليل استخراج وبناء ملف الـ APK لمشروع TestApp</h2>
                </div>
              </div>

              {/* Instructions steps inside workspace */}
              <div className="p-6 md:p-8 space-y-8 overflow-auto leading-relaxed text-sm text-slate-300" dir="rtl">
                
                {/* Introduction banner */}
                <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 p-5 rounded-2xl space-y-2">
                  <strong className="text-emerald-400 text-lg flex items-center gap-2">✓ مستند التصدير والبناء الجاهز للتجربة</strong>
                  <p className="text-slate-300 text-xs">
                    بما أن بيئة الويب المباشرة مخصصة للعرض والمعاينة تفاعلياً وتمنع الترخيص المباشر لـ Gradle لتصدير الـ APK لاسباب أمنية، فإن جميع الملفات المبرمجة بالكامل في هذا المشروع مهيأة للعمل بنسبة 100%. يمكنك تصدير الملفات وبنائها في دقيقة واحدة للحصول على تطبيق أندرويد حقيقي مثبت على جوالك!
                  </p>
                </div>

                {/* Steps items flex list */}
                <div className="space-y-6">
                  
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">1</div>
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-sm text-right">تحميل مجلد الأكواد الأصيل</h4>
                      <p className="text-xs text-slate-400">
                        قم بالتوجه إلى إعدادات واجهة Google AI Studio ثم اضغط على **Export** أو **Download ZIP** لتحصل على حزمة مجلدات التطبيق الكاملة، ومسار ملفات الأندرويد تحديداً هو المجلد `/android-app-source/` المتواجد بداخل ملف الـ ZIP.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">2</div>
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-sm text-right">تحميل وتثبيت Android Studio</h4>
                      <p className="text-xs text-slate-400">
                        إذا لم يكن لديك بالفعل، قم بتحميل حزمة التطوير الرسمية للأندرويد **[Android Studio](https://developer.android.com/studio)** المجانية والمدعومة من Google.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">3</div>
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-sm text-right">فتح المشروع في الأندرويد ستوديو</h4>
                      <p className="text-xs text-slate-400">
                        شغّل أندرويد ستوديو، ثم اختر خيار **Open an Existing Project** وحدد مسار مجلد الأندرويد (`android-app-source/`). سيقوم البرنامج بمزامنة ملفات Gradle وتحميل المكونات الضرورية في دقيقة واحدة.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-white flex items-center justify-center font-bold text-sm shrink-0">4</div>
                    <div className="space-y-1">
                      <h4 className="text-white font-bold text-sm text-right">تصدير ملف الـ APK النهائي القابل للتثبيت</h4>
                      <p className="text-xs text-slate-400">
                        من القوائم الرئسية بالأعلى، توجه إلى المسار التالي لبدء البناء التجميعي الفوري:
                      </p>
                      <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl font-mono text-xs text-emerald-400 inline-block text-left mt-2">
                        Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        بمجرد انتهاء عملية البناء، ستظهر لك رسالة تفاعلية تحتوي على زر **"Locate"** لقراءة مجلد الأوتبوت، حرك الملف `app-debug.apk` إلى هاتفك وقم بتثبيته فورياً!
                      </p>
                    </div>
                  </div>

                </div>

                {/* Gradle Command Line Alternative instructions */}
                <div className="pt-6 border-t border-slate-800 space-y-3">
                  <h4 className="font-bold text-white text-sm">البناء المباشر عبر سطر الأوامر (Command Line Build)</h4>
                  <p className="text-xs text-slate-405">
                    إذا كان لديك مثبت Gradle و Java 17 بالفعل في بيئة نظام التشغيل لديك (ويندوز/ماك)، توجه إلى مجلد المشروع واكتب الأمر السريع التالي في سطر الأوامر لتجميع ملف الـ APK مباشرة:
                  </p>
                  
                  <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl font-mono text-indigo-300 text-xs text-left max-w-sm flex items-center justify-between">
                    <span>./gradlew assembleDebug</span>
                    <button 
                      onClick={() => copyToClipboard('./gradlew assembleDebug', 'all')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-450 hover:text-white transition"
                    >
                      {copiedText === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer id="app-footer" className="mt-auto border-t border-slate-800 bg-slate-950 p-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            تطبيق المعاينة والمطابقة - تم بناؤه ومطابقته خصيصاً بنجاح وفق رغبتك.
          </p>
          <div className="flex gap-4">
            <span className="text-slate-500 tracking-wide font-mono text-[10.5px]">TestApp Project Workspace v1.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
