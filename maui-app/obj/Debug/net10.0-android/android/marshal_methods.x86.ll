; ModuleID = 'marshal_methods.x86.ll'
source_filename = "marshal_methods.x86.ll"
target datalayout = "e-m:e-p:32:32-p270:32:32-p271:32:32-p272:64:64-f64:32:64-f80:32-n8:16:32-S128"
target triple = "i686-unknown-linux-android21"

%struct.MarshalMethodName = type {
	i64, ; uint64_t id
	ptr ; char* name
}

%struct.MarshalMethodsManagedClass = type {
	i32, ; uint32_t token
	ptr ; MonoClass klass
}

@assembly_image_cache = dso_local local_unnamed_addr global [351 x ptr] zeroinitializer, align 4

; Each entry maps hash of an assembly name to an index into the `assembly_image_cache` array
@assembly_image_cache_hashes = dso_local local_unnamed_addr constant [1053 x i32] [
	i32 u0x0027eb9e, ; 0: System.Net.NetworkInformation.dll => 70
	i32 u0x00345a11, ; 1: lib_System.Net.Requests.dll.so => 74
	i32 u0x009b21bb, ; 2: System.Net.NameResolution.dll => 69
	i32 u0x00c8cc5d, ; 3: lib_Xamarin.AndroidX.Loader.dll.so => 271
	i32 u0x00e0bbf7, ; 4: lib_System.Xml.XmlSerializer.dll.so => 166
	i32 u0x00efe298, ; 5: System.Runtime.Intrinsics.dll => 111
	i32 u0x0119bc86, ; 6: lib_Microsoft.Extensions.DependencyInjection.Abstractions.dll.so => 192
	i32 u0x01487925, ; 7: LOCATION_TRACKING.dll => 0
	i32 u0x01cdfed1, ; 8: System.Linq.AsyncEnumerable => 59
	i32 u0x01f2c4e1, ; 9: Xamarin.AndroidX.Lifecycle.Runtime => 262
	i32 u0x0211b5dc, ; 10: Xamarin.Google.Guava.ListenableFuture.dll => 303
	i32 u0x02139ac3, ; 11: System.IO.FileSystem.DriveInfo => 48
	i32 u0x025a8054, ; 12: System.Net.WebSockets.dll => 83
	i32 u0x02664405, ; 13: lib-uk-Microsoft.Maui.Controls.resources.dll.so => 345
	i32 u0x028aa24d, ; 14: System.Threading.Thread => 149
	i32 u0x03358480, ; 15: lib_Microsoft.Maui.dll.so => 211
	i32 u0x0335cdbc, ; 16: ca/Microsoft.Maui.Controls.resources => 317
	i32 u0x03f75868, ; 17: System.Diagnostics.StackTrace => 30
	i32 u0x0410f24b, ; 18: System.Security.Cryptography.Primitives => 127
	i32 u0x044bb714, ; 19: Microsoft.Maui.Graphics.dll => 213
	i32 u0x04e7b0a1, ; 20: System.Runtime.CompilerServices.VisualC.dll => 105
	i32 u0x056606a6, ; 21: lib_System.Collections.NonGeneric.dll.so => 10
	i32 u0x05dc54b4, ; 22: Microsoft.Extensions.Diagnostics.Abstractions => 194
	i32 u0x060d4943, ; 23: Xamarin.AndroidX.SlidingPaneLayout => 285
	i32 u0x0621fa55, ; 24: lib_System.Net.ServerSentEvents.dll.so => 76
	i32 u0x065dd880, ; 25: lib_System.Linq.Queryable.dll.so => 62
	i32 u0x06989c2e, ; 26: Xamarin.AndroidX.Navigation.Runtime.Android.dll => 276
	i32 u0x06c2cd46, ; 27: zh-HK/Microsoft.Maui.Controls.resources => 347
	i32 u0x06e4e181, ; 28: lib_Xamarin.Google.Guava.ListenableFuture.dll.so => 303
	i32 u0x06ee56d3, ; 29: lib_System.Net.Mail.dll.so => 68
	i32 u0x06ffddbc, ; 30: System.Runtime.InteropServices => 110
	i32 u0x0720e5bb, ; 31: Xamarin.AndroidX.Navigation.Common.Android.dll => 273
	i32 u0x072f9521, ; 32: Xamarin.AndroidX.SlidingPaneLayout.dll => 285
	i32 u0x074aea82, ; 33: System.Threading.Channels.dll => 143
	i32 u0x0772c6a7, ; 34: lib_System.Diagnostics.TextWriterTraceListener.dll.so => 31
	i32 u0x0881c32f, ; 35: System.Net.WebHeaderCollection => 80
	i32 u0x08f064cf, ; 36: System.Security.Cryptography.Primitives.dll => 127
	i32 u0x097ed3c0, ; 37: System.ComponentModel.Annotations => 13
	i32 u0x098905a2, ; 38: lib_Xamarin.AndroidX.Concurrent.Futures.dll.so => 238
	i32 u0x09d975c3, ; 39: Xamarin.AndroidX.Collection.dll => 235
	i32 u0x0a0c2bd0, ; 40: lib_Xamarin.AndroidX.Activity.dll.so => 224
	i32 u0x0a81994f, ; 41: System.ServiceProcess => 135
	i32 u0x0ade3a75, ; 42: Xamarin.AndroidX.SwipeRefreshLayout.dll => 287
	i32 u0x0ae43932, ; 43: lib_Xamarin.AndroidX.Tracing.Tracing.dll.so => 288
	i32 u0x0aee6a3d, ; 44: lib-vi-Microsoft.Maui.Controls.resources.dll.so => 346
	i32 u0x0aeedc53, ; 45: lib_Xamarin.Google.Android.Material.dll.so => 299
	i32 u0x0afca281, ; 46: System.ValueTuple.dll => 155
	i32 u0x0b0de1c3, ; 47: lib_System.Xml.XPath.XDocument.dll.so => 163
	i32 u0x0b63b1e1, ; 48: lib_System.Net.Http.Json.dll.so => 65
	i32 u0x0b721a36, ; 49: lib-pl-Microsoft.Maui.Controls.resources.dll.so => 336
	i32 u0x0ba65f85, ; 50: vi/Microsoft.Maui.Controls.resources.dll => 346
	i32 u0x0ba8e231, ; 51: lib_System.Net.ServicePoint.dll.so => 77
	i32 u0x0be195c3, ; 52: zh-HK/Microsoft.Maui.Controls.resources.dll => 347
	i32 u0x0c38ff48, ; 53: System.ComponentModel => 18
	i32 u0x0c7b2e71, ; 54: Xamarin.AndroidX.Browser.dll => 233
	i32 u0x0cbc4dce, ; 55: System.Threading.AccessControl.dll => 142
	i32 u0x0cfa66a6, ; 56: lib_System.IO.Compression.FileSystem.dll.so => 44
	i32 u0x0d1f8edb, ; 57: System.Diagnostics.Debug => 26
	i32 u0x0d3ad0d0, ; 58: Microsoft.Extensions.Diagnostics.dll => 193
	i32 u0x0d73bff4, ; 59: lib_Microsoft.Extensions.Logging.Debug.dll.so => 203
	i32 u0x0dc10265, ; 60: Microsoft.CSharp.dll => 1
	i32 u0x0dc2edec, ; 61: lib_Xamarin.AndroidX.Core.ViewTree.dll.so => 244
	i32 u0x0dc2f416, ; 62: lib_Xamarin.AndroidX.CustomView.dll.so => 246
	i32 u0x0dcb05c4, ; 63: System.Linq.Parallel => 61
	i32 u0x0dd133ce, ; 64: System.Globalization => 42
	i32 u0x0e3c65a0, ; 65: lib_System.Threading.AccessControl.dll.so => 142
	i32 u0x0e762ada, ; 66: lib-nb-Microsoft.Maui.Controls.resources.dll.so => 334
	i32 u0x0eb2f8c5, ; 67: System.Reflection.Emit.Lightweight => 94
	i32 u0x0ec71be0, ; 68: lib_System.Security.SecureString.dll.so => 132
	i32 u0x0ecfdca9, ; 69: lib_Xamarin.Android.Glide.dll.so => 220
	i32 u0x0edddcf6, ; 70: lib_Plugin.LocalNotification.dll.so => 214
	i32 u0x0f27af52, ; 71: Microsoft.AspNetCore.Components.dll => 180
	i32 u0x0f99119d, ; 72: Xamarin.AndroidX.ConstraintLayout.dll => 239
	i32 u0x107abf20, ; 73: System.Threading.Timer.dll => 151
	i32 u0x109c6ab8, ; 74: Xamarin.AndroidX.Lifecycle.LiveData.dll => 258
	i32 u0x10b7d2b7, ; 75: Xamarin.AndroidX.Interpolator => 255
	i32 u0x10bf9929, ; 76: cs/Microsoft.Maui.Controls.resources.dll => 318
	i32 u0x10c1d9f6, ; 77: lib_System.Data.DataSetExtensions.dll.so => 23
	i32 u0x113d3381, ; 78: lib-sk-Microsoft.Maui.Controls.resources.dll.so => 341
	i32 u0x1159791e, ; 79: System.IO.Pipes.AccessControl.dll => 55
	i32 u0x11d123fd, ; 80: System.Net.Ping.dll => 71
	i32 u0x13031348, ; 81: Xamarin.AndroidX.Activity.dll => 224
	i32 u0x132b30dd, ; 82: System.Numerics => 86
	i32 u0x1331a702, ; 83: lib_Xamarin.Google.Crypto.Tink.Android.dll.so => 301
	i32 u0x136bf828, ; 84: lib_System.Runtime.dll.so => 119
	i32 u0x14095832, ; 85: ja/Microsoft.Maui.Controls.resources.dll => 331
	i32 u0x146817a2, ; 86: Xamarin.AndroidX.Lifecycle.Common => 256
	i32 u0x14afd810, ; 87: SQLitePCLRaw.lib.e_sqlite3.android.dll => 218
	i32 u0x14eaf2a7, ; 88: lib_System.ComponentModel.Annotations.dll.so => 13
	i32 u0x153e1455, ; 89: it/Microsoft.Maui.Controls.resources.dll => 330
	i32 u0x15502fa0, ; 90: cs/Microsoft.Maui.Controls.resources => 318
	i32 u0x15766b7b, ; 91: System.ServiceModel.Web => 134
	i32 u0x15c177ae, ; 92: lib_Microsoft.Extensions.Configuration.dll.so => 186
	i32 u0x15e184df, ; 93: lib_System.Runtime.Loader.dll.so => 112
	i32 u0x15ebe147, ; 94: System.IO.Pipes => 56
	i32 u0x1658bf94, ; 95: System.Transactions.Local => 153
	i32 u0x16646418, ; 96: System.Net.ServicePoint.dll => 77
	i32 u0x16a510e1, ; 97: System.Threading.Thread.dll => 149
	i32 u0x16d476c4, ; 98: System.IO.Hashing.dll => 176
	i32 u0x16fe439a, ; 99: System.Memory.dll => 64
	i32 u0x1766c1f7, ; 100: System.Threading.ThreadPool.dll => 150
	i32 u0x1778984a, ; 101: lib_Xamarin.AndroidX.ResourceInspection.Annotation.dll.so => 280
	i32 u0x17969339, ; 102: _Microsoft.Android.Resource.Designer => 350
	i32 u0x180c08d0, ; 103: WindowsBase => 169
	i32 u0x195d1904, ; 104: Xamarin.AndroidX.Lifecycle.Runtime.Android => 263
	i32 u0x198cd3eb, ; 105: lib_System.Security.Cryptography.Encoding.dll.so => 125
	i32 u0x19f6996b, ; 106: sv/Microsoft.Maui.Controls.resources.dll => 342
	i32 u0x1a4e3ec4, ; 107: Xamarin.AndroidX.ConstraintLayout.Core => 240
	i32 u0x1a61054f, ; 108: System.Collections => 12
	i32 u0x1ae0ec2c, ; 109: Xamarin.AndroidX.Fragment.dll => 253
	i32 u0x1ae969b2, ; 110: System.Security.Cryptography.X509Certificates => 128
	i32 u0x1b317bfd, ; 111: System.Web.HttpUtility.dll => 156
	i32 u0x1b46a9fd, ; 112: lib_Xamarin.AndroidX.Lifecycle.Runtime.Ktx.dll.so => 264
	i32 u0x1b5932ea, ; 113: lib_Mono.Android.Runtime.dll.so => 174
	i32 u0x1b611806, ; 114: System.Runtime.Serialization.Primitives.dll => 116
	i32 u0x1bc4415d, ; 115: mscorlib => 170
	i32 u0x1bc6ffe7, ; 116: lib_Java.Interop.dll.so => 172
	i32 u0x1bff388e, ; 117: System.dll => 168
	i32 u0x1c690cb9, ; 118: Xamarin.AndroidX.Interpolator.dll => 255
	i32 u0x1c78d08a, ; 119: lib_System.Private.Uri.dll.so => 89
	i32 u0x1d48410e, ; 120: lib_Xamarin.AndroidX.SlidingPaneLayout.dll.so => 285
	i32 u0x1d4d8185, ; 121: lib_System.Runtime.Serialization.dll.so => 118
	i32 u0x1dbae811, ; 122: System.ObjectModel => 87
	i32 u0x1dd2dc50, ; 123: id/Microsoft.Maui.Controls.resources.dll => 329
	i32 u0x1e092f31, ; 124: fi/Microsoft.Maui.Controls.resources.dll => 323
	i32 u0x1e0ca050, ; 125: Plugin.LocalNotification.dll => 214
	i32 u0x1e9789de, ; 126: Microsoft.Extensions.Primitives.dll => 206
	i32 u0x1f1dceb7, ; 127: lib_System.Security.Cryptography.Primitives.dll.so => 127
	i32 u0x1f443e2d, ; 128: lib_System.AppContext.dll.so => 6
	i32 u0x1f6088c2, ; 129: System.Transactions.dll => 154
	i32 u0x1f6bf43d, ; 130: hi/Microsoft.Maui.Controls.resources => 326
	i32 u0x1f9b4faa, ; 131: System.Linq.Queryable => 62
	i32 u0x20216150, ; 132: Microsoft.Extensions.Logging => 201
	i32 u0x20303736, ; 133: System.IO.FileSystem.dll => 51
	i32 u0x2080b118, ; 134: System.Runtime.Extensions => 106
	i32 u0x20924146, ; 135: System.Runtime.Serialization.Xml => 117
	i32 u0x20bbb280, ; 136: System.Globalization.Calendars => 40
	i32 u0x2116ab2f, ; 137: Xamarin.JSpecify.dll => 309
	i32 u0x213954e7, ; 138: Jsr305Binding => 300
	i32 u0x218bdf07, ; 139: Xamarin.AndroidX.Core.ViewTree.dll => 244
	i32 u0x220f6a86, ; 140: Microsoft.Extensions.FileProviders.Embedded.dll => 197
	i32 u0x22697083, ; 141: System.Security.Cryptography.Cng => 123
	i32 u0x234b6fb2, ; 142: pt-BR/Microsoft.Maui.Controls.resources.dll => 337
	i32 u0x236793de, ; 143: lib_GoogleGson.dll.so => 178
	i32 u0x2386616a, ; 144: lib_System.ServiceModel.Web.dll.so => 134
	i32 u0x2397454a, ; 145: lib_System.Collections.Specialized.dll.so => 11
	i32 u0x23d83352, ; 146: System.IO.IsolatedStorage.dll => 52
	i32 u0x23eaab34, ; 147: lib_System.Core.dll.so => 21
	i32 u0x24154ecb, ; 148: System.IO.Compression.FileSystem => 44
	i32 u0x2459aaf0, ; 149: lib_System.Net.Sockets.dll.so => 78
	i32 u0x2493d7b9, ; 150: System.Security.Cryptography.Algorithms => 122
	i32 u0x2512d1c5, ; 151: Xamarin.AndroidX.Lifecycle.Runtime.Android.dll => 263
	i32 u0x2568904f, ; 152: Xamarin.AndroidX.CustomView => 246
	i32 u0x25fcbe08, ; 153: lib_Microsoft.Extensions.FileProviders.Physical.dll.so => 198
	i32 u0x26233b86, ; 154: Xamarin.AndroidX.Emoji2.ViewsHelper.dll => 251
	i32 u0x26249f17, ; 155: lib_Xamarin.AndroidX.CustomView.PoolingContainer.dll.so => 247
	i32 u0x262968a7, ; 156: lib_System.Reflection.Extensions.dll.so => 96
	i32 u0x262d781c, ; 157: lib-de-Microsoft.Maui.Controls.resources.dll.so => 320
	i32 u0x2660a755, ; 158: System.Net => 84
	i32 u0x27787397, ; 159: System.Text.Encodings.Web.dll => 139
	i32 u0x278c7790, ; 160: Xamarin.AndroidX.VersionedParcelable => 293
	i32 u0x27b53050, ; 161: lib_System.Data.Common.dll.so => 22
	i32 u0x27b6d01f, ; 162: Xamarin.AndroidX.Arch.Core.Common.dll => 231
	i32 u0x2814a96c, ; 163: System.Collections.Concurrent => 8
	i32 u0x282acf5e, ; 164: lib_System.IO.FileSystem.dll.so => 51
	i32 u0x28607aa1, ; 165: lib-pt-BR-Microsoft.Maui.Controls.resources.dll.so => 337
	i32 u0x28bdabca, ; 166: System.Net.Security => 75
	i32 u0x2904cf94, ; 167: ca/Microsoft.Maui.Controls.resources.dll => 317
	i32 u0x29293ff5, ; 168: System.Xml.Linq.dll => 159
	i32 u0x29352520, ; 169: Xamarin.KotlinX.Coroutines.Android.dll => 311
	i32 u0x29423679, ; 170: lib_Xamarin.AndroidX.CursorAdapter.dll.so => 245
	i32 u0x295a9e3d, ; 171: System.Windows => 158
	i32 u0x296c7566, ; 172: lib_System.Xml.dll.so => 167
	i32 u0x29af2b3b, ; 173: System.Reflection.Emit => 95
	i32 u0x29bd7e5b, ; 174: Xamarin.Jetbrains.Annotations => 308
	i32 u0x29be9df3, ; 175: System.IO.Compression.ZipFile => 45
	i32 u0x2a1e8ecb, ; 176: ko/Microsoft.Maui.Controls.resources.dll => 332
	i32 u0x2a4afd4a, ; 177: de/Microsoft.Maui.Controls.resources.dll => 320
	i32 u0x2b15ed29, ; 178: System.Runtime.Loader.dll => 112
	i32 u0x2b9ce19e, ; 179: Microsoft.Extensions.Options.ConfigurationExtensions => 205
	i32 u0x2ba1ca8c, ; 180: lib_System.Security.dll.so => 133
	i32 u0x2bd14e96, ; 181: System.Security.SecureString.dll => 132
	i32 u0x2ca248c0, ; 182: SQLitePCLRaw.batteries_v2 => 216
	i32 u0x2cd6293c, ; 183: System.Diagnostics.Contracts.dll => 25
	i32 u0x2d052d0c, ; 184: Xamarin.Android.Glide.Annotations.dll => 221
	i32 u0x2d322560, ; 185: lib_System.Xml.XmlDocument.dll.so => 165
	i32 u0x2d445acd, ; 186: System.Net.Requests => 74
	i32 u0x2d745423, ; 187: System.IO.Pipes.dll => 56
	i32 u0x2e394f87, ; 188: System.IO.Compression => 46
	i32 u0x2ea3d5c7, ; 189: lib_Microsoft.AspNetCore.Components.WebView.Maui.dll.so => 184
	i32 u0x2eec5558, ; 190: lib_System.Reflection.dll.so => 100
	i32 u0x2f0980eb, ; 191: Microsoft.Extensions.Options => 204
	i32 u0x2f0fe5eb, ; 192: lib_System.Reflection.DispatchProxy.dll.so => 92
	i32 u0x2f1c1e69, ; 193: Xamarin.AndroidX.CustomView.PoolingContainer.dll => 247
	i32 u0x2fec3262, ; 194: Microsoft.AspNetCore.Components.WebView.Maui => 184
	i32 u0x2ff6fb9f, ; 195: System.Data.Common => 22
	i32 u0x302809e9, ; 196: Xamarin.AndroidX.Lifecycle.LiveData.Core.Ktx.dll => 260
	i32 u0x30a0e95c, ; 197: lib_System.Threading.Thread.dll.so => 149
	i32 u0x311247b5, ; 198: System.Private.Uri.dll => 89
	i32 u0x317d5b75, ; 199: System.IO.Compression.Brotli => 43
	i32 u0x31a103c6, ; 200: System.Xml.XPath.dll => 164
	i32 u0x31b69d60, ; 201: System.Net.Quic => 73
	i32 u0x3312831d, ; 202: lib_Xamarin.AndroidX.DrawerLayout.dll.so => 248
	i32 u0x33e88be1, ; 203: ar/Microsoft.Maui.Controls.resources => 316
	i32 u0x340ac0b8, ; 204: Microsoft.VisualBasic => 3
	i32 u0x34505120, ; 205: System.Globalization.dll => 42
	i32 u0x3463c971, ; 206: System.Net.Http.Json => 65
	i32 u0x34a30d77, ; 207: System.IO.Hashing => 176
	i32 u0x34a66c56, ; 208: lib_System.IO.Pipes.dll.so => 56
	i32 u0x351454c7, ; 209: lib_SQLitePCLRaw.lib.e_sqlite3.android.dll.so => 218
	i32 u0x352e5794, ; 210: lib_Xamarin.Google.ErrorProne.Annotations.dll.so => 302
	i32 u0x35e25008, ; 211: System.ComponentModel.Primitives.dll => 16
	i32 u0x3612ff2c, ; 212: lib_System.IO.dll.so => 58
	i32 u0x3635f196, ; 213: lib_Xamarin.GooglePlayServices.Basement.dll.so => 305
	i32 u0x364e69a3, ; 214: System.IO.MemoryMappedFiles.dll => 53
	i32 u0x36e9595b, ; 215: lib_System.Transactions.dll.so => 154
	i32 u0x370eff4f, ; 216: lib_System.Globalization.Extensions.dll.so => 41
	i32 u0x373f6a31, ; 217: tr/Microsoft.Maui.Controls.resources.dll => 344
	i32 u0x3751ef41, ; 218: Xamarin.Google.Guava.ListenableFuture => 303
	i32 u0x3787b992, ; 219: lib_System.ComponentModel.DataAnnotations.dll.so => 14
	i32 u0x37ea9cd7, ; 220: lib_Xamarin.AndroidX.Lifecycle.ViewModel.Android.dll.so => 267
	i32 u0x382704bd, ; 221: lib_Xamarin.AndroidX.Emoji2.ViewsHelper.dll.so => 251
	i32 u0x387472ba, ; 222: lib_Microsoft.Extensions.Options.ConfigurationExtensions.dll.so => 205
	i32 u0x38c136f7, ; 223: System.Runtime.InteropServices.JavaScript.dll => 108
	i32 u0x38d89c1d, ; 224: lib_Xamarin.AndroidX.Lifecycle.Common.Jvm.dll.so => 257
	i32 u0x38fe5498, ; 225: Xamarin.AndroidX.Window.WindowCore.Jvm => 298
	i32 u0x39481653, ; 226: lib_mscorlib.dll.so => 170
	i32 u0x399f1f06, ; 227: Xamarin.Google.Crypto.Tink.Android => 301
	i32 u0x39adca5e, ; 228: Xamarin.AndroidX.Lifecycle.Common.dll => 256
	i32 u0x3a20ecf3, ; 229: System.Diagnostics.Tracing => 34
	i32 u0x3a2aaa1d, ; 230: System.Xml.XDocument => 162
	i32 u0x3a8b0a79, ; 231: lib_Xamarin.KotlinX.Coroutines.Android.dll.so => 311
	i32 u0x3acd0267, ; 232: System.Private.DataContractSerialization.dll => 88
	i32 u0x3ad7b407, ; 233: System.Diagnostics.Tools => 32
	i32 u0x3b008d80, ; 234: lib_Xamarin.AndroidX.DynamicAnimation.dll.so => 249
	i32 u0x3b2c715c, ; 235: System.Collections.dll => 12
	i32 u0x3b3271e4, ; 236: zh-Hans/Microsoft.Maui.Controls.resources => 348
	i32 u0x3b458447, ; 237: lib_System.Threading.Tasks.Dataflow.dll.so => 145
	i32 u0x3b45fb35, ; 238: System.IO.FileSystem => 51
	i32 u0x3b4797e5, ; 239: es/Microsoft.Maui.Controls.resources => 322
	i32 u0x3b8e5ef8, ; 240: Microsoft.Extensions.FileSystemGlobbing.dll => 199
	i32 u0x3bb6bd33, ; 241: System.IO.UnmanagedMemoryStream.dll => 57
	i32 u0x3c4644f5, ; 242: Microsoft.Extensions.Validation.dll => 207
	i32 u0x3c5e5b62, ; 243: Xamarin.AndroidX.SavedState.dll => 281
	i32 u0x3cbffa41, ; 244: System.Drawing => 36
	i32 u0x3d548d92, ; 245: Microsoft.Extensions.DependencyInjection.Abstractions => 192
	i32 u0x3d5a6611, ; 246: da/Microsoft.Maui.Controls.resources.dll => 319
	i32 u0x3d7be038, ; 247: Xamarin.Google.ErrorProne.Annotations.dll => 302
	i32 u0x3dbaaf8f, ; 248: Xamarin.AndroidX.AppCompat => 229
	i32 u0x3dc84a49, ; 249: System.Drawing.Primitives.dll => 35
	i32 u0x3df150e9, ; 250: lib_Xamarin.AndroidX.Interpolator.dll.so => 255
	i32 u0x3e444eb4, ; 251: System.Linq.Expressions.dll => 60
	i32 u0x3e5c42fd, ; 252: lib_System.Reflection.TypeExtensions.dll.so => 99
	i32 u0x3e865cbd, ; 253: Microsoft.Extensions.Diagnostics.Abstractions.dll => 194
	i32 u0x3eb776a1, ; 254: Xamarin.AndroidX.Lifecycle.ViewModel.dll => 266
	i32 u0x3ebd41f6, ; 255: lib_System.Collections.dll.so => 12
	i32 u0x3ecd3024, ; 256: lib_System.Resources.Reader.dll.so => 101
	i32 u0x3eea4db8, ; 257: lib_Microsoft.Extensions.Primitives.dll.so => 206
	i32 u0x3f3e1e33, ; 258: lib_Xamarin.AndroidX.Lifecycle.Process.dll.so => 261
	i32 u0x3f9dcf8c, ; 259: GoogleGson => 178
	i32 u0x408b17f4, ; 260: System.ComponentModel.TypeConverter => 17
	i32 u0x409e66d8, ; 261: Xamarin.Kotlin.StdLib => 310
	i32 u0x41761b2c, ; 262: System => 168
	i32 u0x41fb142e, ; 263: Microsoft.Extensions.Configuration.FileExtensions.dll => 189
	i32 u0x422dfa8a, ; 264: Microsoft.Extensions.Hosting.Abstractions => 200
	i32 u0x4232ae7b, ; 265: lib_System.Reflection.Emit.dll.so => 95
	i32 u0x42be2972, ; 266: lib_System.Text.Encodings.Web.dll.so => 139
	i32 u0x42c091c1, ; 267: lib_Xamarin.Android.Glide.GifDecoder.dll.so => 223
	i32 u0x42da3e50, ; 268: Xamarin.AndroidX.Lifecycle.Runtime.Ktx.dll => 264
	i32 u0x43362f15, ; 269: Microsoft.Extensions.Logging.Debug => 203
	i32 u0x4393e151, ; 270: lib-th-Microsoft.Maui.Controls.resources.dll.so => 343
	i32 u0x441f18e1, ; 271: lib_System.Security.Cryptography.OpenSsl.dll.so => 126
	i32 u0x444e5c8e, ; 272: lib_System.ComponentModel.TypeConverter.dll.so => 17
	i32 u0x44549c93, ; 273: lib_System.Net.WebProxy.dll.so => 81
	i32 u0x4474042c, ; 274: lib_System.Numerics.Vectors.dll.so => 85
	i32 u0x447dc2e6, ; 275: Xamarin.AndroidX.Window => 296
	i32 u0x44845810, ; 276: lib_System.Net.Http.dll.so => 66
	i32 u0x44c3958b, ; 277: lib_System.Private.DataContractSerialization.dll.so => 88
	i32 u0x4528fc75, ; 278: System.Net.ServerSentEvents.dll => 76
	i32 u0x45bde382, ; 279: lib_System.Windows.dll.so => 158
	i32 u0x45c677b2, ; 280: System.Web.dll => 157
	i32 u0x45ec7ce1, ; 281: Microsoft.Extensions.FileProviders.Abstractions.dll => 195
	i32 u0x460b48eb, ; 282: Xamarin.AndroidX.VectorDrawable.Animated => 292
	i32 u0x463a8801, ; 283: Xamarin.AndroidX.Navigation.Runtime.dll => 275
	i32 u0x464305ed, ; 284: fi/Microsoft.Maui.Controls.resources => 323
	i32 u0x466ae52b, ; 285: lib_System.Threading.Overlapped.dll.so => 144
	i32 u0x47a87de7, ; 286: lib_System.Resources.Writer.dll.so => 103
	i32 u0x47b79c15, ; 287: pl/Microsoft.Maui.Controls.resources.dll => 336
	i32 u0x47c7b4fa, ; 288: Xamarin.AndroidX.Arch.Core.Common => 231
	i32 u0x480a69ad, ; 289: System.Diagnostics.Process => 29
	i32 u0x48aa6be3, ; 290: System.IO.IsolatedStorage => 52
	i32 u0x48bf92c4, ; 291: lib_Xamarin.AndroidX.Collection.dll.so => 235
	i32 u0x49654709, ; 292: lib_System.Threading.Timer.dll.so => 151
	i32 u0x498b4f6b, ; 293: lib_Microsoft.AspNetCore.Components.Web.dll.so => 182
	i32 u0x499b8219, ; 294: nb/Microsoft.Maui.Controls.resources.dll => 334
	i32 u0x49dd578a, ; 295: lib_Microsoft.Extensions.Hosting.Abstractions.dll.so => 200
	i32 u0x4a0189ae, ; 296: lib-hi-Microsoft.Maui.Controls.resources.dll.so => 326
	i32 u0x4a4cd262, ; 297: Xamarin.AndroidX.Collection.Jvm.dll => 236
	i32 u0x4a8cb221, ; 298: lib_Xamarin.JSpecify.dll.so => 309
	i32 u0x4aaf6f7c, ; 299: Microsoft.Win32.Registry => 5
	i32 u0x4ae97402, ; 300: lib_Microsoft.Maui.Graphics.dll.so => 213
	i32 u0x4b275854, ; 301: Xamarin.KotlinX.Serialization.Core.Jvm => 315
	i32 u0x4b5eebe5, ; 302: Xamarin.AndroidX.Startup.StartupRuntime.dll => 286
	i32 u0x4b64b158, ; 303: Xamarin.KotlinX.Coroutines.Core.dll => 312
	i32 u0x4b863c7a, ; 304: lib_System.Private.Xml.Linq.dll.so => 90
	i32 u0x4b8a64a7, ; 305: Xamarin.AndroidX.VectorDrawable => 291
	i32 u0x4bb12d98, ; 306: lib_System.Runtime.Serialization.Xml.dll.so => 117
	i32 u0x4be46b58, ; 307: Xamarin.AndroidX.Collection.Ktx => 237
	i32 u0x4c071bea, ; 308: Xamarin.KotlinX.Coroutines.Android => 311
	i32 u0x4c3393c5, ; 309: Xamarin.AndroidX.Annotation.Jvm => 228
	i32 u0x4d0585a0, ; 310: SQLitePCLRaw.core.dll => 217
	i32 u0x4d14ee2b, ; 311: Xamarin.AndroidX.DrawerLayout.dll => 248
	i32 u0x4de0ce3b, ; 312: lib_Xamarin.AndroidX.ProfileInstaller.ProfileInstaller.dll.so => 278
	i32 u0x4e08a30b, ; 313: System.Private.DataContractSerialization => 88
	i32 u0x4e50159c, ; 314: Xamarin.AndroidX.Navigation.Common.Android => 273
	i32 u0x4e52c7a5, ; 315: Microsoft.Extensions.Validation => 207
	i32 u0x4ea003f9, ; 316: lib_Xamarin.AndroidX.Navigation.Common.Android.dll.so => 273
	i32 u0x4ed70c83, ; 317: Xamarin.AndroidX.Window.dll => 296
	i32 u0x4eed2679, ; 318: System.Linq => 63
	i32 u0x4f97822f, ; 319: System.Runtime.Serialization.Json.dll => 115
	i32 u0x50255dd9, ; 320: lib-hr-Microsoft.Maui.Controls.resources.dll.so => 327
	i32 u0x50acdfd7, ; 321: lib-ca-Microsoft.Maui.Controls.resources.dll.so => 317
	i32 u0x50f5c1df, ; 322: lib_Xamarin.AndroidX.Lifecycle.ViewModelSavedState.Android.dll.so => 270
	i32 u0x514d38cd, ; 323: System.IO => 58
	i32 u0x52114ed3, ; 324: Xamarin.AndroidX.SavedState => 281
	i32 u0x523dc4c1, ; 325: System.Resources.ResourceManager => 102
	i32 u0x533678bd, ; 326: lib_System.Private.CoreLib.dll.so => 177
	i32 u0x53701274, ; 327: lib_System.IO.FileSystem.Watcher.dll.so => 50
	i32 u0x53936ab4, ; 328: System.Configuration.dll => 19
	i32 u0x53cefc50, ; 329: Xamarin.AndroidX.CoordinatorLayout => 241
	i32 u0x53d71638, ; 330: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.Android.dll => 270
	i32 u0x53f80ba6, ; 331: System.Runtime.Serialization.Formatters.dll => 114
	i32 u0x5423e47b, ; 332: System.Runtime.CompilerServices.Unsafe => 104
	i32 u0x54246761, ; 333: lib_System.Diagnostics.Tools.dll.so => 32
	i32 u0x5498bac9, ; 334: lib_Microsoft.VisualBasic.dll.so => 3
	i32 u0x54ca50cb, ; 335: System.Runtime.CompilerServices.VisualC => 105
	i32 u0x557217fe, ; 336: lib_System.Numerics.dll.so => 86
	i32 u0x557b5293, ; 337: System.Runtime.Handles => 107
	i32 u0x558bc221, ; 338: Xamarin.Google.Crypto.Tink.Android.dll => 301
	i32 u0x55ab7451, ; 339: Xamarin.AndroidX.Lifecycle.Common.Jvm => 257
	i32 u0x55d10363, ; 340: System.Net.Quic.dll => 73
	i32 u0x55dfaca3, ; 341: lib_Microsoft.Win32.Primitives.dll.so => 4
	i32 u0x55e55df2, ; 342: Xamarin.AndroidX.Lifecycle.ViewModel.Android => 267
	i32 u0x568cd628, ; 343: System.Formats.Asn1.dll => 38
	i32 u0x569fcb36, ; 344: System.Diagnostics.Tools.dll => 32
	i32 u0x56abe34a, ; 345: Microsoft.Extensions.FileProviders.Composite => 196
	i32 u0x56c018af, ; 346: lib_System.IO.UnmanagedMemoryStream.dll.so => 57
	i32 u0x56e36530, ; 347: System.Runtime.Extensions.dll => 106
	i32 u0x56e7a7ad, ; 348: System.Net.Security.dll => 75
	i32 u0x5718a9ef, ; 349: System.Collections.Immutable.dll => 9
	i32 u0x57201017, ; 350: System.Security.Cryptography.OpenSsl => 126
	i32 u0x57261233, ; 351: System.IO.Compression.dll => 46
	i32 u0x57924923, ; 352: Xamarin.AndroidX.AppCompat.AppCompatResources => 230
	i32 u0x57a5e912, ; 353: Microsoft.Extensions.Primitives => 206
	i32 u0x5833866d, ; 354: System.Collections.Immutable => 9
	i32 u0x583e844f, ; 355: System.IO.Compression.Brotli.dll => 43
	i32 u0x58a57897, ; 356: Microsoft.Win32.Primitives => 4
	i32 u0x58cffa99, ; 357: Xamarin.AndroidX.SavedState.SavedState.Ktx.dll => 283
	i32 u0x58fd6613, ; 358: hi/Microsoft.Maui.Controls.resources.dll => 326
	i32 u0x596b5b3a, ; 359: lib_System.Drawing.Primitives.dll.so => 35
	i32 u0x5a48cf6c, ; 360: el/Microsoft.Maui.Controls.resources.dll => 321
	i32 u0x5aaa0216, ; 361: Microsoft.Extensions.FileSystemGlobbing => 199
	i32 u0x5ae1cd96, ; 362: Plugin.LocalNotification => 214
	i32 u0x5b9331b6, ; 363: System.Diagnostics.TextWriterTraceListener => 31
	i32 u0x5be451c7, ; 364: lib_Xamarin.AndroidX.Browser.dll.so => 233
	i32 u0x5bf8ca0f, ; 365: System.Text.RegularExpressions.dll => 141
	i32 u0x5bfdbb43, ; 366: System.Reflection.Emit.dll => 95
	i32 u0x5c2ef6eb, ; 367: Microsoft.AspNetCore.Components.WebView.Maui.dll => 184
	i32 u0x5c680b40, ; 368: System.Reflection.Extensions.dll => 96
	i32 u0x5c7be408, ; 369: sk/Microsoft.Maui.Controls.resources.dll => 341
	i32 u0x5cabc9a4, ; 370: fr/Microsoft.Maui.Controls.resources => 324
	i32 u0x5cb489e2, ; 371: Xamarin.AndroidX.Tracing.Tracing.Android => 289
	i32 u0x5d552ab7, ; 372: System.IO.FileSystem.Primitives => 49
	i32 u0x5d5a6c40, ; 373: System.Threading.Tasks.Dataflow.dll => 145
	i32 u0x5dccd455, ; 374: System.Runtime.Serialization.Json => 115
	i32 u0x5e0b6fdc, ; 375: Xamarin.KotlinX.Serialization.Core.Jvm.dll => 315
	i32 u0x5e2d7514, ; 376: System.Threading.Overlapped => 144
	i32 u0x5e2e3abe, ; 377: lib_Microsoft.VisualBasic.Core.dll.so => 2
	i32 u0x5e33306d, ; 378: sv/Microsoft.Maui.Controls.resources => 342
	i32 u0x5e7321d2, ; 379: lib_System.ComponentModel.Primitives.dll.so => 16
	i32 u0x5e832359, ; 380: lib_Microsoft.AspNetCore.Authorization.dll.so => 179
	i32 u0x5ed5f779, ; 381: zh-Hant/Microsoft.Maui.Controls.resources => 349
	i32 u0x5ef2ee25, ; 382: System.Runtime.Serialization.dll => 118
	i32 u0x5f3292e5, ; 383: lib_Microsoft.Extensions.Diagnostics.dll.so => 193
	i32 u0x5f3ec4dd, ; 384: Xamarin.Google.ErrorProne.Annotations => 302
	i32 u0x5f6f0b5b, ; 385: System.Xml.Serialization => 161
	i32 u0x5fa7b851, ; 386: System.Net.WebClient => 79
	i32 u0x6078995d, ; 387: System.Net.WebSockets.Client.dll => 82
	i32 u0x60892624, ; 388: lib_System.Formats.Tar.dll.so => 39
	i32 u0x60b0136a, ; 389: Xamarin.AndroidX.Loader.dll => 271
	i32 u0x60b33958, ; 390: System.Dynamic.Runtime => 37
	i32 u0x60d97228, ; 391: Xamarin.AndroidX.ViewPager2 => 295
	i32 u0x60ec189c, ; 392: lib_Xamarin.AndroidX.Arch.Core.Runtime.dll.so => 232
	i32 u0x61533167, ; 393: Microsoft.Extensions.Configuration.Json => 190
	i32 u0x6176eff7, ; 394: Xamarin.AndroidX.Emoji2.ViewsHelper => 251
	i32 u0x6188ba7e, ; 395: Xamarin.AndroidX.CursorAdapter => 245
	i32 u0x61b9038d, ; 396: System.Net.Http.dll => 66
	i32 u0x61c036ca, ; 397: System.Text.RegularExpressions => 141
	i32 u0x61d59e0e, ; 398: System.ComponentModel.EventBasedAsync.dll => 15
	i32 u0x62021776, ; 399: lib_System.IO.Compression.dll.so => 46
	i32 u0x620a8774, ; 400: lib_System.Xml.ReaderWriter.dll.so => 160
	i32 u0x625755ef, ; 401: lib_WindowsBase.dll.so => 169
	i32 u0x62a37b76, ; 402: Microsoft.AspNetCore.Components.WebView => 183
	i32 u0x62c6282e, ; 403: System.Runtime => 119
	i32 u0x62cec1a2, ; 404: lib_Xamarin.KotlinX.Coroutines.Core.Jvm.dll.so => 313
	i32 u0x62d6c1e4, ; 405: Xamarin.AndroidX.Tracing.Tracing.dll => 288
	i32 u0x62d6ea10, ; 406: Xamarin.Google.Android.Material.dll => 299
	i32 u0x638b1991, ; 407: Xamarin.AndroidX.ConstraintLayout => 239
	i32 u0x63dee9da, ; 408: System.IO.FileSystem.DriveInfo.dll => 48
	i32 u0x63fca3d0, ; 409: System.Net.Primitives.dll => 72
	i32 u0x640c0103, ; 410: System.Net.WebSockets => 83
	i32 u0x641979dd, ; 411: Xamarin.JSpecify => 309
	i32 u0x641f3e5a, ; 412: System.Security.Cryptography => 129
	i32 u0x64d1e4f5, ; 413: System.Reflection.Metadata => 97
	i32 u0x6525abc9, ; 414: System.Security.Cryptography.Csp => 124
	i32 u0x654b1498, ; 415: lib_System.Transactions.Local.dll.so => 153
	i32 u0x656b7698, ; 416: System.Diagnostics.Debug.dll => 26
	i32 u0x660284a1, ; 417: SQLitePCLRaw.lib.e_sqlite3.android => 218
	i32 u0x6670b12e, ; 418: lib_System.Security.AccessControl.dll.so => 120
	i32 u0x66888819, ; 419: Xamarin.AndroidX.Lifecycle.LiveData.Core.Ktx => 260
	i32 u0x66e27484, ; 420: System.Reflection.dll => 100
	i32 u0x66ffb0f8, ; 421: System.Diagnostics.FileVersionInfo.dll => 28
	i32 u0x6715dc86, ; 422: Xamarin.AndroidX.CardView.dll => 234
	i32 u0x67577fe1, ; 423: lib_System.Runtime.CompilerServices.VisualC.dll.so => 105
	i32 u0x677cd287, ; 424: ro/Microsoft.Maui.Controls.resources.dll => 339
	i32 u0x67fe8db2, ; 425: System.Transactions.Local.dll => 153
	i32 u0x68139a0d, ; 426: System.IO.Pipelines.dll => 54
	i32 u0x6816ab6a, ; 427: Mono.Android.Export => 173
	i32 u0x6853a83d, ; 428: Microsoft.Win32.Primitives.dll => 4
	i32 u0x68cc9d1e, ; 429: System.Resources.Reader.dll => 101
	i32 u0x68eb6e69, ; 430: Microsoft.AspNetCore.Components.Web.dll => 182
	i32 u0x68f61ae4, ; 431: lib_System.Formats.Asn1.dll.so => 38
	i32 u0x690d4b7d, ; 432: lib-zh-Hant-Microsoft.Maui.Controls.resources.dll.so => 349
	i32 u0x69239124, ; 433: System.Diagnostics.TraceSource.dll => 33
	i32 u0x693efa35, ; 434: lib_System.Net.WebHeaderCollection.dll.so => 80
	i32 u0x6942234e, ; 435: System.Reflection.Extensions => 96
	i32 u0x6947f945, ; 436: Xamarin.AndroidX.SwipeRefreshLayout => 287
	i32 u0x6988f147, ; 437: Microsoft.Extensions.Logging.dll => 201
	i32 u0x69ae5451, ; 438: lib_System.Runtime.InteropServices.JavaScript.dll.so => 108
	i32 u0x69d6d061, ; 439: lib_Xamarin.AndroidX.Window.WindowCore.Jvm.dll.so => 298
	i32 u0x69dc03cc, ; 440: System.Core.dll => 21
	i32 u0x69ec0683, ; 441: System.Globalization.Extensions.dll => 41
	i32 u0x69f4f41d, ; 442: lib_Xamarin.AndroidX.AppCompat.dll.so => 229
	i32 u0x6a216153, ; 443: Mono.Android.Runtime.dll => 174
	i32 u0x6a539b49, ; 444: lib_System.Runtime.Extensions.dll.so => 106
	i32 u0x6a96652d, ; 445: Xamarin.AndroidX.Fragment => 253
	i32 u0x6afaf338, ; 446: lib_System.Threading.dll.so => 152
	i32 u0x6b645ada, ; 447: lib-fr-Microsoft.Maui.Controls.resources.dll.so => 324
	i32 u0x6bbb2a76, ; 448: lib_Microsoft.Extensions.FileProviders.Abstractions.dll.so => 195
	i32 u0x6bcd3296, ; 449: Xamarin.AndroidX.Loader => 271
	i32 u0x6be1e423, ; 450: nb/Microsoft.Maui.Controls.resources => 334
	i32 u0x6be29904, ; 451: lib_Xamarin.GooglePlayServices.Base.dll.so => 304
	i32 u0x6c111525, ; 452: Xamarin.Kotlin.StdLib.dll => 310
	i32 u0x6c13413e, ; 453: Xamarin.Google.Android.Material => 299
	i32 u0x6c5562e0, ; 454: lib_Xamarin.KotlinX.Coroutines.Core.dll.so => 312
	i32 u0x6c652ce8, ; 455: Xamarin.AndroidX.Navigation.UI.dll => 277
	i32 u0x6c687fa7, ; 456: Microsoft.VisualBasic.Core => 2
	i32 u0x6c96614d, ; 457: hu/Microsoft.Maui.Controls.resources => 328
	i32 u0x6cbab720, ; 458: System.Text.Encoding.Extensions => 137
	i32 u0x6cc30c8c, ; 459: System.Runtime.Serialization.Formatters => 114
	i32 u0x6cf3d432, ; 460: lib_Xamarin.AndroidX.VersionedParcelable.dll.so => 293
	i32 u0x6cff90ba, ; 461: Microsoft.Extensions.Logging.Abstractions.dll => 202
	i32 u0x6dcaebf7, ; 462: uk/Microsoft.Maui.Controls.resources.dll => 345
	i32 u0x6e1ed932, ; 463: Xamarin.Android.Glide.Annotations => 221
	i32 u0x6ec71a65, ; 464: System.Linq.Expressions => 60
	i32 u0x6f7a29e4, ; 465: System.Reflection.Primitives => 98
	i32 u0x6fab02f2, ; 466: lib_Xamarin.AndroidX.ConstraintLayout.dll.so => 239
	i32 u0x7009e4c3, ; 467: System.Formats.Tar.dll => 39
	i32 u0x705fa726, ; 468: Xamarin.AndroidX.Arch.Core.Runtime.dll => 232
	i32 u0x7070c6c0, ; 469: lib-zh-Hans-Microsoft.Maui.Controls.resources.dll.so => 348
	i32 u0x70972b6d, ; 470: System.Diagnostics.Contracts => 25
	i32 u0x70a66bdd, ; 471: System.Reflection.Metadata.dll => 97
	i32 u0x7124cf39, ; 472: System.Reflection.DispatchProxy => 92
	i32 u0x71490522, ; 473: System.Resources.ResourceManager.dll => 102
	i32 u0x71c62d98, ; 474: Xamarin.GooglePlayServices.Basement => 305
	i32 u0x71dc7c8b, ; 475: System.Collections.NonGeneric.dll => 10
	i32 u0x720d83ac, ; 476: lib_LOCATION_TRACKING.dll.so => 0
	i32 u0x72fcebde, ; 477: lib_Xamarin.AndroidX.AppCompat.AppCompatResources.dll.so => 230
	i32 u0x731dd955, ; 478: lib_Mono.Android.dll.so => 175
	i32 u0x73674b00, ; 479: lib_SQLitePCLRaw.provider.e_sqlite3.dll.so => 219
	i32 u0x739bd4a8, ; 480: System.Private.Xml.Linq => 90
	i32 u0x73b20433, ; 481: lib_System.IO.FileSystem.Primitives.dll.so => 49
	i32 u0x73fbecbe, ; 482: lib_System.Memory.dll.so => 64
	i32 u0x74126030, ; 483: lib_System.Net.WebClient.dll.so => 79
	i32 u0x74280428, ; 484: lib_Microsoft.Extensions.Validation.dll.so => 207
	i32 u0x74a1c5bb, ; 485: System.Resources.Writer => 103
	i32 u0x74d743bf, ; 486: ja/Microsoft.Maui.Controls.resources => 331
	i32 u0x74eee4ef, ; 487: Xamarin.AndroidX.Security.SecurityCrypto.dll => 284
	i32 u0x75533a5e, ; 488: Microsoft.Extensions.Configuration.dll => 186
	i32 u0x7593c33f, ; 489: lib_System.IO.FileSystem.AccessControl.dll.so => 47
	i32 u0x75ec88d8, ; 490: System.Net.ServerSentEvents => 76
	i32 u0x765c50a4, ; 491: Xamarin.Android.Glide.GifDecoder => 223
	i32 u0x77d08969, ; 492: lib_Microsoft.Extensions.Configuration.FileExtensions.dll.so => 189
	i32 u0x77ec19b4, ; 493: System.Buffers.dll => 7
	i32 u0x781074ce, ; 494: hr/Microsoft.Maui.Controls.resources => 327
	i32 u0x784d3e49, ; 495: lib_System.Net.dll.so => 84
	i32 u0x785e97f1, ; 496: Xamarin.AndroidX.Lifecycle.ViewModel => 266
	i32 u0x78b622b1, ; 497: ar/Microsoft.Maui.Controls.resources.dll => 316
	i32 u0x790376c9, ; 498: lib_Xamarin.AndroidX.Annotation.Experimental.dll.so => 227
	i32 u0x791a414b, ; 499: Xamarin.Android.Glide => 220
	i32 u0x7970be4f, ; 500: lib-he-Microsoft.Maui.Controls.resources.dll.so => 325
	i32 u0x79d00016, ; 501: it/Microsoft.Maui.Controls.resources => 330
	i32 u0x79eb68ee, ; 502: System.Private.Xml => 91
	i32 u0x7a16417d, ; 503: Microsoft.Extensions.Configuration.Binder.dll => 188
	i32 u0x7a80bd4e, ; 504: Xamarin.AndroidX.Lifecycle.LiveData.Core.dll => 259
	i32 u0x7aabe35d, ; 505: lib_Microsoft.Extensions.FileProviders.Embedded.dll.so => 197
	i32 u0x7aca0819, ; 506: System.Windows.dll => 158
	i32 u0x7b350579, ; 507: lib__Microsoft.Android.Resource.Designer.dll.so => 350
	i32 u0x7b3b4d96, ; 508: System.Linq.AsyncEnumerable.dll => 59
	i32 u0x7b473a37, ; 509: lib_Xamarin.AndroidX.Fragment.Ktx.dll.so => 254
	i32 u0x7b6f419e, ; 510: System.Diagnostics.TraceSource => 33
	i32 u0x7b864712, ; 511: Microsoft.Extensions.FileProviders.Physical => 198
	i32 u0x7b8f6ff7, ; 512: lib_System.Runtime.Serialization.Json.dll.so => 115
	i32 u0x7bf8cdab, ; 513: System.Runtime.dll => 119
	i32 u0x7c51ebd4, ; 514: lib_System.Net.HttpListener.dll.so => 67
	i32 u0x7c9bf920, ; 515: System.Numerics.Vectors => 85
	i32 u0x7d603cde, ; 516: SQLitePCLRaw.provider.e_sqlite3.dll => 219
	i32 u0x7d702d52, ; 517: lib_System.Text.Encoding.dll.so => 138
	i32 u0x7ec9ffe9, ; 518: System.Console => 20
	i32 u0x7eed5835, ; 519: Xamarin.GooglePlayServices.Base.dll => 304
	i32 u0x7fb38cd2, ; 520: System.Collections.Specialized => 11
	i32 u0x7fc7a41e, ; 521: System.Xml.XmlSerializer.dll => 166
	i32 u0x7fd90a71, ; 522: lib_System.Text.Encoding.CodePages.dll.so => 136
	i32 u0x7fdcdc37, ; 523: lib-ko-Microsoft.Maui.Controls.resources.dll.so => 332
	i32 u0x7ff65cf5, ; 524: Microsoft.VisualBasic.dll => 3
	i32 u0x802a7166, ; 525: lib_System.Diagnostics.FileVersionInfo.dll.so => 28
	i32 u0x8030853e, ; 526: ko/Microsoft.Maui.Controls.resources => 332
	i32 u0x8044e1bd, ; 527: lib-ms-Microsoft.Maui.Controls.resources.dll.so => 333
	i32 u0x8081c489, ; 528: lib_Jsr305Binding.dll.so => 300
	i32 u0x80bd55ad, ; 529: Microsoft.Maui => 211
	i32 u0x80f2f56e, ; 530: lib_System.Runtime.Serialization.Formatters.dll.so => 114
	i32 u0x810c11c2, ; 531: ro/Microsoft.Maui.Controls.resources => 339
	i32 u0x8115bdf3, ; 532: lib_System.Resources.ResourceManager.dll.so => 102
	i32 u0x816751d8, ; 533: lib_System.Diagnostics.DiagnosticSource.dll.so => 27
	i32 u0x81a110ae, ; 534: lib_System.ComponentModel.EventBasedAsync.dll.so => 15
	i32 u0x820d22b3, ; 535: Microsoft.Extensions.Options.dll => 204
	i32 u0x82364da2, ; 536: lib_System.Buffers.dll.so => 7
	i32 u0x82759cff, ; 537: LOCATION_TRACKING => 0
	i32 u0x82a8237c, ; 538: Microsoft.Extensions.Logging.Abstractions => 202
	i32 u0x82b6c85e, ; 539: System.ObjectModel.dll => 87
	i32 u0x82bb5429, ; 540: lib_System.Linq.Expressions.dll.so => 60
	i32 u0x82c1cf3e, ; 541: lib_System.Net.Quic.dll.so => 73
	i32 u0x832ec206, ; 542: lib_System.Diagnostics.StackTrace.dll.so => 30
	i32 u0x83323b38, ; 543: Xamarin.KotlinX.Coroutines.Core.Jvm.dll => 313
	i32 u0x8334206b, ; 544: System.Net.Http => 66
	i32 u0x842e93b2, ; 545: Xamarin.AndroidX.VectorDrawable.Animated.dll => 292
	i32 u0x8471e4ec, ; 546: System.Threading.Tasks.Parallel => 147
	i32 u0x857e4dd2, ; 547: lib_System.Net.WebSockets.dll.so => 83
	i32 u0x8628f1a4, ; 548: lib-ru-Microsoft.Maui.Controls.resources.dll.so => 340
	i32 u0x863c6ac5, ; 549: System.Xml.Serialization.dll => 161
	i32 u0x865f9104, ; 550: Xamarin.AndroidX.Window.WindowCore.dll => 297
	i32 u0x867c9c52, ; 551: System.Globalization.Extensions => 41
	i32 u0x86b0fd78, ; 552: lib_Xamarin.AndroidX.Lifecycle.ViewModel.Ktx.dll.so => 268
	i32 u0x86bba59b, ; 553: lib_Microsoft.Maui.Controls.dll.so => 209
	i32 u0x8702d9a2, ; 554: System.Security.AccessControl.dll => 120
	i32 u0x871c9c1b, ; 555: Microsoft.Extensions.Configuration.Abstractions => 187
	i32 u0x872eeb7b, ; 556: Xamarin.Android.Glide.DiskLruCache.dll => 222
	i32 u0x875633cc, ; 557: fr/Microsoft.Maui.Controls.resources.dll => 324
	i32 u0x87a1a22b, ; 558: lib-it-Microsoft.Maui.Controls.resources.dll.so => 330
	i32 u0x87e25095, ; 559: Xamarin.AndroidX.RecyclerView.dll => 279
	i32 u0x87e7fdbb, ; 560: lib-nl-Microsoft.Maui.Controls.resources.dll.so => 335
	i32 u0x881f94da, ; 561: lib_netstandard.dll.so => 171
	i32 u0x8873eb17, ; 562: th/Microsoft.Maui.Controls.resources => 343
	i32 u0x887ae6a1, ; 563: lib_Xamarin.AndroidX.Lifecycle.Runtime.Android.dll.so => 263
	i32 u0x88937130, ; 564: Xamarin.AndroidX.Window.WindowCore => 297
	i32 u0x88acefcd, ; 565: System.ServiceModel.Web.dll => 134
	i32 u0x88d8bfaa, ; 566: System.Net.Sockets => 78
	i32 u0x88ed6f27, ; 567: lib_SQLitePCLRaw.batteries_v2.dll.so => 216
	i32 u0x88ffe49e, ; 568: System.Net.Mail => 68
	i32 u0x896b7878, ; 569: System.Private.CoreLib.dll => 177
	i32 u0x8a068af2, ; 570: Xamarin.AndroidX.Annotation.dll => 226
	i32 u0x8a0cb154, ; 571: lib_Xamarin.GooglePlayServices.Location.dll.so => 306
	i32 u0x8a52059a, ; 572: System.Threading.Tasks.Parallel.dll => 147
	i32 u0x8b804dbf, ; 573: System.Runtime.InteropServices.RuntimeInformation.dll => 109
	i32 u0x8bbaa2cd, ; 574: System.ValueTuple => 155
	i32 u0x8c20c628, ; 575: lib-fi-Microsoft.Maui.Controls.resources.dll.so => 323
	i32 u0x8c20f140, ; 576: lib_System.Console.dll.so => 20
	i32 u0x8c40e0db, ; 577: System.Net.Primitives => 72
	i32 u0x8c93dffb, ; 578: lib_SQLite-net.dll.so => 215
	i32 u0x8d19e4a2, ; 579: lib_Xamarin.AndroidX.Lifecycle.LiveData.dll.so => 258
	i32 u0x8d24e767, ; 580: System.Xml.ReaderWriter.dll => 160
	i32 u0x8d3fac99, ; 581: tr/Microsoft.Maui.Controls.resources => 344
	i32 u0x8d52b2e2, ; 582: Microsoft.Extensions.Configuration => 186
	i32 u0x8d52d3de, ; 583: lib_System.Threading.Tasks.dll.so => 148
	i32 u0x8dc6dbce, ; 584: System.Security.Cryptography.Csp.dll => 124
	i32 u0x8dcb0101, ; 585: lib_Xamarin.AndroidX.Navigation.Fragment.dll.so => 274
	i32 u0x8e02310f, ; 586: lib-ar-Microsoft.Maui.Controls.resources.dll.so => 316
	i32 u0x8e114655, ; 587: System.Security.Principal.Windows.dll => 130
	i32 u0x8e14e237, ; 588: lib_Microsoft.Extensions.FileSystemGlobbing.dll.so => 199
	i32 u0x8e3c8202, ; 589: lib_Microsoft.AspNetCore.Components.dll.so => 180
	i32 u0x8e4e8441, ; 590: Xamarin.AndroidX.Window.WindowCore.Jvm.dll => 298
	i32 u0x8f24faee, ; 591: System.Web.HttpUtility => 156
	i32 u0x8f41c524, ; 592: Xamarin.AndroidX.Emoji2.dll => 250
	i32 u0x8f4e087a, ; 593: lib_System.Web.dll.so => 157
	i32 u0x8f8c64e2, ; 594: lib_System.Private.Xml.dll.so => 91
	i32 u0x8fb9f4b2, ; 595: Microsoft.AspNetCore.Components => 180
	i32 u0x903eb247, ; 596: lib_Xamarin.AndroidX.Window.WindowCore.dll.so => 297
	i32 u0x905355ed, ; 597: System.Threading.Tasks.Dataflow => 145
	i32 u0x905caa9d, ; 598: nl/Microsoft.Maui.Controls.resources => 335
	i32 u0x906d466b, ; 599: Xamarin.AndroidX.Collection.Ktx.dll => 237
	i32 u0x90e50509, ; 600: lib_System.Reflection.Primitives.dll.so => 98
	i32 u0x911615a7, ; 601: lib_Xamarin.AndroidX.Fragment.dll.so => 253
	i32 u0x912896e5, ; 602: System.Console.dll => 20
	i32 u0x9130f5e7, ; 603: System.ComponentModel.DataAnnotations.dll => 14
	i32 u0x919672ca, ; 604: Microsoft.JSInterop.dll => 208
	i32 u0x91abdf3a, ; 605: lib_Xamarin.AndroidX.Startup.StartupRuntime.dll.so => 286
	i32 u0x924edee6, ; 606: System.Text.Encoding.dll => 138
	i32 u0x928c75ca, ; 607: System.Net.Sockets.dll => 78
	i32 u0x92916334, ; 608: System.Linq.Parallel.dll => 61
	i32 u0x92f11675, ; 609: SQLitePCLRaw.batteries_v2.dll => 216
	i32 u0x92f50938, ; 610: Xamarin.AndroidX.ConstraintLayout.Core.dll => 240
	i32 u0x93554fdc, ; 611: netstandard.dll => 171
	i32 u0x93634cc0, ; 612: lib_Xamarin.AndroidX.Lifecycle.LiveData.Core.Ktx.dll.so => 260
	i32 u0x93918882, ; 613: Java.Interop.dll => 172
	i32 u0x93dba8a1, ; 614: Microsoft.Maui.Controls => 209
	i32 u0x940d5c2f, ; 615: System.ComponentModel.EventBasedAsync => 15
	i32 u0x94147f61, ; 616: System.Net.ServicePoint => 77
	i32 u0x9438d78e, ; 617: lib_System.Text.Json.dll.so => 140
	i32 u0x9469ba86, ; 618: lib_Xamarin.AndroidX.Lifecycle.Runtime.dll.so => 262
	i32 u0x94798bc5, ; 619: System.AppContext.dll => 6
	i32 u0x94a1db18, ; 620: lib-id-Microsoft.Maui.Controls.resources.dll.so => 329
	i32 u0x94fad8e5, ; 621: lib_Xamarin.AndroidX.Activity.Ktx.dll.so => 225
	i32 u0x95178668, ; 622: System.Data.DataSetExtensions => 23
	i32 u0x955cf248, ; 623: Xamarin.AndroidX.Lifecycle.Runtime.dll => 262
	i32 u0x9593ae7f, ; 624: lib_Xamarin.AndroidX.SavedState.dll.so => 281
	i32 u0x963ac2da, ; 625: sk/Microsoft.Maui.Controls.resources => 341
	i32 u0x9659e17c, ; 626: Xamarin.Android.Glide.dll => 220
	i32 u0x96bea474, ; 627: lib_Microsoft.Maui.Controls.Xaml.dll.so => 210
	i32 u0x9737ca08, ; 628: Microsoft.AspNetCore.Authorization => 179
	i32 u0x974b89a2, ; 629: System.Reflection.Emit.Lightweight.dll => 94
	i32 u0x98ba5a04, ; 630: Microsoft.CSharp => 1
	i32 u0x98e90c02, ; 631: lib_Xamarin.GooglePlayServices.Tasks.dll.so => 307
	i32 u0x9930ee42, ; 632: System.Text.Encodings.Web => 139
	i32 u0x999dcf0d, ; 633: Xamarin.AndroidX.Lifecycle.Runtime.Ktx.Android => 265
	i32 u0x99e2e424, ; 634: Xamarin.AndroidX.Lifecycle.Runtime.Ktx => 264
	i32 u0x99e370f2, ; 635: Xamarin.AndroidX.VectorDrawable.dll => 291
	i32 u0x9a1756ac, ; 636: System.Text.Encoding.Extensions.dll => 137
	i32 u0x9a20430d, ; 637: System.Net.Ping => 71
	i32 u0x9a206149, ; 638: Microsoft.AspNetCore.Components.Forms => 181
	i32 u0x9a5a3337, ; 639: System.Threading.ThreadPool => 150
	i32 u0x9a83ffe1, ; 640: Microsoft.Extensions.FileProviders.Abstractions => 195
	i32 u0x9b24ab96, ; 641: lib_System.Runtime.Serialization.Primitives.dll.so => 116
	i32 u0x9b500441, ; 642: Xamarin.KotlinX.Coroutines.Core.Jvm => 313
	i32 u0x9b5e5b1c, ; 643: lib_System.Diagnostics.Contracts.dll.so => 25
	i32 u0x9be14c08, ; 644: Xamarin.AndroidX.Fragment.Ktx => 254
	i32 u0x9bf052c1, ; 645: Microsoft.Extensions.Logging.Debug.dll => 203
	i32 u0x9bfe3a41, ; 646: System.Private.Xml.dll => 91
	i32 u0x9c165ff9, ; 647: System.Reflection.TypeExtensions.dll => 99
	i32 u0x9c375496, ; 648: Xamarin.AndroidX.CursorAdapter.dll => 245
	i32 u0x9c70e6c9, ; 649: Xamarin.AndroidX.DynamicAnimation => 249
	i32 u0x9c96ac4c, ; 650: lib_Xamarin.AndroidX.Navigation.UI.dll.so => 277
	i32 u0x9c97ad4a, ; 651: System.Diagnostics.TextWriterTraceListener.dll => 31
	i32 u0x9cc03a58, ; 652: System.IO.Compression.ZipFile.dll => 45
	i32 u0x9cd341b2, ; 653: lib_System.Threading.Tasks.Parallel.dll.so => 147
	i32 u0x9cf12c56, ; 654: Xamarin.AndroidX.Lifecycle.LiveData => 258
	i32 u0x9e78dac1, ; 655: lib_Xamarin.AndroidX.Lifecycle.ViewModelSavedState.dll.so => 269
	i32 u0x9ec022c0, ; 656: Xamarin.Android.Glide.DiskLruCache => 222
	i32 u0x9ec4cf01, ; 657: System.Runtime.Loader => 112
	i32 u0x9ecf752a, ; 658: System.Xml.XDocument.dll => 162
	i32 u0x9ee22cc0, ; 659: System.Drawing.Primitives => 35
	i32 u0x9f3b757e, ; 660: Xamarin.KotlinX.Coroutines.Core => 312
	i32 u0x9f7ea921, ; 661: lib_System.Runtime.InteropServices.dll.so => 110
	i32 u0x9f8c6f40, ; 662: System.Data.Common.dll => 22
	i32 u0xa026a50c, ; 663: System.Runtime.Serialization.Xml.dll => 117
	i32 u0xa075d95f, ; 664: Microsoft.AspNetCore.Components.WebView.dll => 183
	i32 u0xa090e36a, ; 665: System.IO.dll => 58
	i32 u0xa0fb56af, ; 666: lib_System.Text.RegularExpressions.dll.so => 141
	i32 u0xa0ff7514, ; 667: Xamarin.AndroidX.Tracing.Tracing => 288
	i32 u0xa1d8b647, ; 668: System.Threading.Tasks.dll => 148
	i32 u0xa1fd7d9f, ; 669: System.Security.Claims => 121
	i32 u0xa21f5a1f, ; 670: System.Security.Cryptography.Cng.dll => 123
	i32 u0xa25c90e5, ; 671: lib_Xamarin.AndroidX.Core.dll.so => 242
	i32 u0xa262a30f, ; 672: System.Runtime.Numerics.dll => 113
	i32 u0xa2ce8457, ; 673: lib-es-Microsoft.Maui.Controls.resources.dll.so => 322
	i32 u0xa2e0939b, ; 674: Xamarin.AndroidX.Activity => 224
	i32 u0xa30769e5, ; 675: System.Threading.Channels => 143
	i32 u0xa30e6e06, ; 676: Microsoft.AspNetCore.Authorization.dll => 179
	i32 u0xa32eb6f0, ; 677: Xamarin.AndroidX.AppCompat.AppCompatResources.dll => 230
	i32 u0xa35f8f92, ; 678: System.IO.Pipes.AccessControl => 55
	i32 u0xa3c818c7, ; 679: lib_System.Net.WebSockets.Client.dll.so => 82
	i32 u0xa3cc7fa7, ; 680: System.Runtime.InteropServices.JavaScript => 108
	i32 u0xa3de87ea, ; 681: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.Android => 270
	i32 u0xa4672f3b, ; 682: Microsoft.Maui.Controls.Xaml => 210
	i32 u0xa493aa02, ; 683: lib_System.Collections.Concurrent.dll.so => 8
	i32 u0xa4caf7a7, ; 684: Microsoft.Maui.dll => 211
	i32 u0xa4d4aaf8, ; 685: lib_System.Security.Cryptography.Cng.dll.so => 123
	i32 u0xa4db22c6, ; 686: System.Text.Encoding.CodePages.dll => 136
	i32 u0xa4e79dfd, ; 687: Xamarin.AndroidX.Lifecycle.ViewModel.Android.dll => 267
	i32 u0xa522693c, ; 688: Xamarin.Jetbrains.Annotations.dll => 308
	i32 u0xa52ac270, ; 689: lib_Xamarin.AndroidX.Window.dll.so => 296
	i32 u0xa553c739, ; 690: lib_System.ValueTuple.dll.so => 155
	i32 u0xa5a0a402, ; 691: Xamarin.AndroidX.ViewPager.dll => 294
	i32 u0xa5b3182d, ; 692: Xamarin.AndroidX.ResourceInspection.Annotation.dll => 280
	i32 u0xa5b67c07, ; 693: Xamarin.AndroidX.Lifecycle.Common.Jvm.dll => 257
	i32 u0xa5c5753c, ; 694: lib_System.Collections.Immutable.dll.so => 9
	i32 u0xa5ea80d9, ; 695: lib_Xamarin.Android.Glide.Annotations.dll.so => 221
	i32 u0xa6133c7f, ; 696: lib_System.IO.FileSystem.DriveInfo.dll.so => 48
	i32 u0xa630ecdd, ; 697: Xamarin.AndroidX.Fragment.Ktx.dll => 254
	i32 u0xa668c988, ; 698: lib_System.Net.NameResolution.dll.so => 69
	i32 u0xa68bc8b3, ; 699: lib_Xamarin.AndroidX.Tracing.Tracing.Android.dll.so => 289
	i32 u0xa7008e0b, ; 700: Microsoft.Maui.Graphics => 213
	i32 u0xa7042ae3, ; 701: uk/Microsoft.Maui.Controls.resources => 345
	i32 u0xa715dd7e, ; 702: System.Xml.XPath.XDocument.dll => 163
	i32 u0xa741ef0b, ; 703: es/Microsoft.Maui.Controls.resources.dll => 322
	i32 u0xa744f665, ; 704: lib_Xamarin.AndroidX.Navigation.Runtime.dll.so => 275
	i32 u0xa78103bc, ; 705: Xamarin.AndroidX.CoordinatorLayout.dll => 241
	i32 u0xa8032c67, ; 706: lib_Microsoft.Win32.Registry.dll.so => 5
	i32 u0xa80db4e1, ; 707: System.Xml.dll => 167
	i32 u0xa81b119f, ; 708: lib_System.Security.Cryptography.dll.so => 129
	i32 u0xa8282c09, ; 709: System.ServiceProcess.dll => 135
	i32 u0xa8298928, ; 710: Xamarin.AndroidX.ResourceInspection.Annotation => 280
	i32 u0xa85a7b6c, ; 711: System.Xml.XmlDocument => 165
	i32 u0xa8c61dcb, ; 712: nl/Microsoft.Maui.Controls.resources.dll => 335
	i32 u0xa8e81f45, ; 713: Microsoft.AspNetCore.Metadata => 185
	i32 u0xa9366b55, ; 714: Xamarin.AndroidX.Tracing.Tracing.Android.dll => 289
	i32 u0xa9379a4f, ; 715: Xamarin.AndroidX.Lifecycle.ViewModel.Ktx.dll => 268
	i32 u0xa9b829f7, ; 716: Xamarin.GooglePlayServices.Base => 304
	i32 u0xa9d96f9b, ; 717: System.Threading.Overlapped.dll => 144
	i32 u0xaa107fc4, ; 718: Xamarin.AndroidX.ViewPager => 294
	i32 u0xaa2b531f, ; 719: lib_System.Globalization.dll.so => 42
	i32 u0xaa36a797, ; 720: Xamarin.AndroidX.Transition => 290
	i32 u0xaa4e51ff, ; 721: el/Microsoft.Maui.Controls.resources => 321
	i32 u0xaa88e550, ; 722: Mono.Android.Export.dll => 173
	i32 u0xaa8a4878, ; 723: Microsoft.Maui.Essentials => 212
	i32 u0xab123e9a, ; 724: Xamarin.AndroidX.Activity.Ktx.dll => 225
	i32 u0xab5734d1, ; 725: lib_Microsoft.AspNetCore.Components.Forms.dll.so => 181
	i32 u0xab5f85c3, ; 726: Jsr305Binding.dll => 300
	i32 u0xab606289, ; 727: System.Globalization.Calendars.dll => 40
	i32 u0xabbc23e8, ; 728: lib_Xamarin.KotlinX.Serialization.Core.Jvm.dll.so => 315
	i32 u0xabdea79a, ; 729: ru/Microsoft.Maui.Controls.resources => 340
	i32 u0xabf58099, ; 730: Xamarin.AndroidX.ExifInterface => 252
	i32 u0xac1dd496, ; 731: System.Net.dll => 84
	i32 u0xac65a11d, ; 732: Microsoft.AspNetCore.Components.Web => 182
	i32 u0xacd6baa9, ; 733: System.IO.UnmanagedMemoryStream => 57
	i32 u0xace3f9b4, ; 734: System.Dynamic.Runtime.dll => 37
	i32 u0xace7ba82, ; 735: lib_System.Security.Principal.Windows.dll.so => 130
	i32 u0xacf080de, ; 736: System.Reflection => 100
	i32 u0xacf097ce, ; 737: System.Threading.AccessControl => 142
	i32 u0xad2a79b6, ; 738: mscorlib.dll => 170
	i32 u0xad6f1e8a, ; 739: System.Private.CoreLib => 177
	i32 u0xad832c4a, ; 740: Microsoft.Extensions.FileProviders.Physical.dll => 198
	i32 u0xad90894d, ; 741: lib_Xamarin.KotlinX.Serialization.Core.dll.so => 314
	i32 u0xaddb6d38, ; 742: Xamarin.AndroidX.ViewPager2.dll => 295
	i32 u0xae037813, ; 743: System.Numerics.Vectors.dll => 85
	i32 u0xae1ce33f, ; 744: Xamarin.AndroidX.Annotation.Experimental.dll => 227
	i32 u0xaeb2d8a5, ; 745: lib_Microsoft.Extensions.Options.dll.so => 204
	i32 u0xaf06273c, ; 746: System.Resources.Reader => 101
	i32 u0xaf3a6b91, ; 747: lib_System.Diagnostics.Debug.dll.so => 26
	i32 u0xaf4af872, ; 748: System.Diagnostics.StackTrace.dll => 30
	i32 u0xaf624531, ; 749: System.Xml.XPath.XDocument => 163
	i32 u0xaf8b1081, ; 750: lib_Xamarin.AndroidX.SavedState.SavedState.Ktx.dll.so => 283
	i32 u0xb0682092, ; 751: System.ComponentModel.dll => 18
	i32 u0xb083f934, ; 752: lib_Microsoft.AspNetCore.Metadata.dll.so => 185
	i32 u0xb0ed41f3, ; 753: System.Security.Principal.Windows => 130
	i32 u0xb115eec7, ; 754: Microsoft.Extensions.Options.ConfigurationExtensions.dll => 205
	i32 u0xb1182a36, ; 755: lib_Xamarin.AndroidX.Navigation.Runtime.Android.dll.so => 276
	i32 u0xb128f886, ; 756: System.Security.Cryptography.Algorithms.dll => 122
	i32 u0xb18af942, ; 757: Xamarin.AndroidX.DrawerLayout => 248
	i32 u0xb1a434a2, ; 758: lib_System.Xml.Linq.dll.so => 159
	i32 u0xb1a7d210, ; 759: lib_Xamarin.AndroidX.Lifecycle.Runtime.Ktx.Android.dll.so => 265
	i32 u0xb21220a3, ; 760: Xamarin.AndroidX.Security.SecurityCrypto => 284
	i32 u0xb223fa8c, ; 761: lib-cs-Microsoft.Maui.Controls.resources.dll.so => 318
	i32 u0xb28cab85, ; 762: lib_Xamarin.Android.Glide.DiskLruCache.dll.so => 222
	i32 u0xb294d40b, ; 763: lib_System.Net.Ping.dll.so => 71
	i32 u0xb2a03f9f, ; 764: Xamarin.AndroidX.Lifecycle.Process.dll => 261
	i32 u0xb3d3821c, ; 765: Xamarin.AndroidX.Startup.StartupRuntime => 286
	i32 u0xb40c4519, ; 766: Microsoft.Extensions.Diagnostics => 193
	i32 u0xb434b64b, ; 767: WindowsBase.dll => 169
	i32 u0xb514b305, ; 768: _Microsoft.Android.Resource.Designer.dll => 350
	i32 u0xb58d85d9, ; 769: lib_System.Runtime.Handles.dll.so => 107
	i32 u0xb593dd05, ; 770: lib_Microsoft.Extensions.FileProviders.Composite.dll.so => 196
	i32 u0xb62a9ccb, ; 771: Xamarin.AndroidX.SavedState.SavedState.Ktx => 283
	i32 u0xb63fa9f0, ; 772: Xamarin.AndroidX.Navigation.Common => 272
	i32 u0xb646e70c, ; 773: Xamarin.GooglePlayServices.Tasks => 307
	i32 u0xb6490b5e, ; 774: lib_Mono.Android.Export.dll.so => 173
	i32 u0xb65adef9, ; 775: Mono.Android.Runtime => 174
	i32 u0xb660be12, ; 776: System.ComponentModel.Primitives => 16
	i32 u0xb6a153b2, ; 777: lib_Xamarin.AndroidX.ViewPager2.dll.so => 295
	i32 u0xb70c6fb4, ; 778: lib_Xamarin.AndroidX.VectorDrawable.dll.so => 291
	i32 u0xb755818f, ; 779: System.Threading.Tasks => 148
	i32 u0xb76be845, ; 780: hu/Microsoft.Maui.Controls.resources.dll => 328
	i32 u0xb7e7c341, ; 781: lib_System.Globalization.Calendars.dll.so => 40
	i32 u0xb838e2b0, ; 782: System.Security.Cryptography.X509Certificates.dll => 128
	i32 u0xb8c22b7f, ; 783: System.Security.Claims.dll => 121
	i32 u0xb8fd311b, ; 784: System.Formats.Asn1 => 38
	i32 u0xb979e222, ; 785: System.Runtime.Serialization => 118
	i32 u0xba0dbf1c, ; 786: System.IO.FileSystem.AccessControl.dll => 47
	i32 u0xba4127cb, ; 787: System.Threading.Tasks.Extensions => 146
	i32 u0xbaa520e7, ; 788: lib_System.ObjectModel.dll.so => 87
	i32 u0xbab301d1, ; 789: System.Security.AccessControl => 120
	i32 u0xbb95ee37, ; 790: System.Diagnostics.Tracing.dll => 34
	i32 u0xbba64c02, ; 791: GoogleGson.dll => 178
	i32 u0xbc4c6465, ; 792: System.Reflection.Primitives.dll => 98
	i32 u0xbc652da7, ; 793: System.IO.MemoryMappedFiles => 53
	i32 u0xbc98c93d, ; 794: lib_Xamarin.AndroidX.Collection.Jvm.dll.so => 236
	i32 u0xbcc610a0, ; 795: lib_System.Reflection.Metadata.dll.so => 97
	i32 u0xbd113355, ; 796: lib_Xamarin.AndroidX.Navigation.Common.dll.so => 272
	i32 u0xbd3726df, ; 797: lib_Microsoft.Extensions.Configuration.Binder.dll.so => 188
	i32 u0xbd78b0c8, ; 798: Xamarin.AndroidX.Navigation.Fragment.dll => 274
	i32 u0xbddce8a2, ; 799: lib_System.Security.Principal.dll.so => 131
	i32 u0xbe3f07c2, ; 800: lib_System.Runtime.CompilerServices.Unsafe.dll.so => 104
	i32 u0xbe4755f4, ; 801: System.Security.SecureString => 132
	i32 u0xbe592c0c, ; 802: System.Web => 157
	i32 u0xbefef58f, ; 803: System.Data.dll => 24
	i32 u0xbf506931, ; 804: System.Xml.XmlDocument.dll => 165
	i32 u0xbff2e236, ; 805: System.Threading => 152
	i32 u0xc04c3c0a, ; 806: System.Runtime.Handles.dll => 107
	i32 u0xc08d007e, ; 807: Xamarin.GooglePlayServices.Basement.dll => 305
	i32 u0xc095e070, ; 808: lib_Xamarin.AndroidX.Lifecycle.Common.dll.so => 256
	i32 u0xc10b79a7, ; 809: Xamarin.AndroidX.Core.ViewTree => 244
	i32 u0xc1c6ebf4, ; 810: System.Reflection.DispatchProxy.dll => 92
	i32 u0xc217efb6, ; 811: lib_Xamarin.AndroidX.ConstraintLayout.Core.dll.so => 240
	i32 u0xc2293e61, ; 812: Xamarin.AndroidX.SavedState.SavedState.Android.dll => 282
	i32 u0xc235e84d, ; 813: Xamarin.AndroidX.CardView => 234
	i32 u0xc2a37b91, ; 814: System.Linq.Queryable.dll => 62
	i32 u0xc2a993fa, ; 815: System.Threading.Tasks.Extensions.dll => 146
	i32 u0xc3428433, ; 816: lib_System.Reflection.Emit.ILGeneration.dll.so => 93
	i32 u0xc35f7fa4, ; 817: System.Resources.Writer.dll => 103
	i32 u0xc37f65ce, ; 818: Microsoft.Win32.Registry.dll => 5
	i32 u0xc3888e16, ; 819: System.ComponentModel.Annotations.dll => 13
	i32 u0xc3ba1d80, ; 820: lib_System.Security.Cryptography.Csp.dll.so => 124
	i32 u0xc3e9b3a2, ; 821: SQLite-net.dll => 215
	i32 u0xc4251ff9, ; 822: System.Security.Cryptography.Encoding => 125
	i32 u0xc4684d9e, ; 823: lib_System.Security.Cryptography.Algorithms.dll.so => 122
	i32 u0xc4a8494a, ; 824: System.Text.Encoding => 138
	i32 u0xc4e76306, ; 825: System.Diagnostics.FileVersionInfo => 28
	i32 u0xc591efe9, ; 826: lib_Microsoft.Extensions.Configuration.Abstractions.dll.so => 187
	i32 u0xc5b097e4, ; 827: System.Net.Requests.dll => 74
	i32 u0xc5b776df, ; 828: Xamarin.AndroidX.CustomView.dll => 246
	i32 u0xc5b79d28, ; 829: System.Data => 24
	i32 u0xc69f3b41, ; 830: lib_System.Data.dll.so => 24
	i32 u0xc71af05d, ; 831: Xamarin.AndroidX.Arch.Core.Runtime => 232
	i32 u0xc76e512c, ; 832: Xamarin.AndroidX.ProfileInstaller.ProfileInstaller.dll => 278
	i32 u0xc774da4f, ; 833: Xamarin.AndroidX.Navigation.Runtime => 275
	i32 u0xc7a3b0f0, ; 834: lib_Xamarin.AndroidX.Transition.dll.so => 290
	i32 u0xc7b797d0, ; 835: lib_Xamarin.AndroidX.Core.Core.Ktx.dll.so => 243
	i32 u0xc821fc10, ; 836: lib_System.ComponentModel.dll.so => 18
	i32 u0xc82afec1, ; 837: System.Text.Json => 140
	i32 u0xc849ca45, ; 838: SQLitePCLRaw.core => 217
	i32 u0xc8693088, ; 839: Xamarin.AndroidX.Activity.Ktx => 225
	i32 u0xc86c06e3, ; 840: Xamarin.AndroidX.Core => 242
	i32 u0xc8a662e9, ; 841: Java.Interop => 172
	i32 u0xc8d10307, ; 842: lib_System.Diagnostics.TraceSource.dll.so => 33
	i32 u0xc9094c00, ; 843: Xamarin.AndroidX.Navigation.Runtime.Android => 276
	i32 u0xc92a6809, ; 844: Xamarin.AndroidX.RecyclerView => 279
	i32 u0xca5de1fa, ; 845: System.Runtime.CompilerServices.Unsafe.dll => 104
	i32 u0xcae37e41, ; 846: System.Security.Cryptography.OpenSsl.dll => 126
	i32 u0xcaf7bd4b, ; 847: Xamarin.AndroidX.CustomView.PoolingContainer => 247
	i32 u0xcb0d0beb, ; 848: Microsoft.Extensions.FileProviders.Composite.dll => 196
	i32 u0xcb5af55c, ; 849: lib_System.Reflection.Emit.Lightweight.dll.so => 94
	i32 u0xcbeae9c6, ; 850: Microsoft.Extensions.Configuration.Binder => 188
	i32 u0xcc5af6ee, ; 851: Microsoft.Extensions.DependencyInjection.dll => 191
	i32 u0xcc6479a0, ; 852: System.Xml => 167
	i32 u0xcc7d82b4, ; 853: netstandard => 171
	i32 u0xcd1dd0db, ; 854: Xamarin.AndroidX.DynamicAnimation.dll => 249
	i32 u0xcd5a809f, ; 855: System.Formats.Tar => 39
	i32 u0xcdd8cd54, ; 856: lib_Xamarin.AndroidX.Emoji2.dll.so => 250
	i32 u0xce3fa116, ; 857: lib_System.Diagnostics.Process.dll.so => 29
	i32 u0xce70fda2, ; 858: hr/Microsoft.Maui.Controls.resources.dll => 327
	i32 u0xce7b5b88, ; 859: Microsoft.AspNetCore.Components.Forms.dll => 181
	i32 u0xcef19b37, ; 860: System.ComponentModel.TypeConverter.dll => 17
	i32 u0xcf3163e6, ; 861: Mono.Android => 175
	i32 u0xcf663a21, ; 862: ru/Microsoft.Maui.Controls.resources.dll => 340
	i32 u0xcfa20c36, ; 863: lib_Xamarin.AndroidX.SwipeRefreshLayout.dll.so => 287
	i32 u0xcfbaacae, ; 864: System.Text.Json.dll => 140
	i32 u0xcfd0c798, ; 865: System.Transactions => 154
	i32 u0xd0418592, ; 866: Xamarin.AndroidX.Concurrent.Futures.dll => 238
	i32 u0xd0483fe8, ; 867: Xamarin.GooglePlayServices.Location.dll => 306
	i32 u0xd09dc5a0, ; 868: Microsoft.JSInterop => 208
	i32 u0xd128d608, ; 869: System.Xml.Linq => 159
	i32 u0xd1854eb4, ; 870: System.Security.dll => 133
	i32 u0xd2757232, ; 871: System.Configuration => 19
	i32 u0xd2ff69f1, ; 872: System.Net.HttpListener => 67
	i32 u0xd310c033, ; 873: lib_Xamarin.Jetbrains.Annotations.dll.so => 308
	i32 u0xd328ac54, ; 874: vi/Microsoft.Maui.Controls.resources => 346
	i32 u0xd4045e1b, ; 875: lib_System.dll.so => 168
	i32 u0xd404ddfe, ; 876: lib_System.Runtime.Intrinsics.dll.so => 111
	i32 u0xd432d20b, ; 877: System.Threading.Timer => 151
	i32 u0xd457e5c9, ; 878: lib_Microsoft.CSharp.dll.so => 1
	i32 u0xd47cb45a, ; 879: lib_Xamarin.AndroidX.Arch.Core.Common.dll.so => 231
	i32 u0xd496c3c3, ; 880: lib_Xamarin.AndroidX.ExifInterface.dll.so => 252
	i32 u0xd4d2575b, ; 881: System.IO.FileSystem.AccessControl => 47
	i32 u0xd505225a, ; 882: lib_System.Xml.XPath.dll.so => 164
	i32 u0xd622b752, ; 883: lib-ro-Microsoft.Maui.Controls.resources.dll.so => 339
	i32 u0xd664cdf2, ; 884: de/Microsoft.Maui.Controls.resources => 320
	i32 u0xd6665034, ; 885: Xamarin.Android.Glide.GifDecoder.dll => 223
	i32 u0xd67a52b3, ; 886: System.Net.WebSockets.Client => 82
	i32 u0xd715a361, ; 887: System.Linq.dll => 63
	i32 u0xd7f95f5a, ; 888: da/Microsoft.Maui.Controls.resources => 319
	i32 u0xd804d57a, ; 889: System.Runtime.InteropServices.RuntimeInformation => 109
	i32 u0xd889aee8, ; 890: lib_System.Threading.Channels.dll.so => 143
	i32 u0xd8950487, ; 891: Xamarin.AndroidX.Annotation.Experimental => 227
	i32 u0xd8bba49d, ; 892: lib_Xamarin.AndroidX.RecyclerView.dll.so => 279
	i32 u0xd8dbab5d, ; 893: System.IO.FileSystem.Primitives.dll => 49
	i32 u0xd90e5f5a, ; 894: Xamarin.AndroidX.Lifecycle.LiveData.Core => 259
	i32 u0xd92e86f1, ; 895: Xamarin.KotlinX.Serialization.Core.dll => 314
	i32 u0xd930cda0, ; 896: Xamarin.AndroidX.Navigation.Fragment => 274
	i32 u0xd943a729, ; 897: System.ComponentModel.DataAnnotations => 14
	i32 u0xd96cf6f7, ; 898: pt-BR/Microsoft.Maui.Controls.resources => 337
	i32 u0xd9f65f5e, ; 899: lib-el-Microsoft.Maui.Controls.resources.dll.so => 321
	i32 u0xd9fdda56, ; 900: Microsoft.Extensions.Configuration.Abstractions.dll => 187
	i32 u0xda2f27df, ; 901: System.Net.NetworkInformation => 70
	i32 u0xda4773dd, ; 902: he/Microsoft.Maui.Controls.resources => 325
	i32 u0xdabf74ac, ; 903: lib_Xamarin.AndroidX.Annotation.Jvm.dll.so => 228
	i32 u0xdae8aa5e, ; 904: Mono.Android.dll => 175
	i32 u0xdb7f7e5d, ; 905: Xamarin.AndroidX.Browser => 233
	i32 u0xdb9df1ce, ; 906: Xamarin.AndroidX.Concurrent.Futures => 238
	i32 u0xdbb50d93, ; 907: ms/Microsoft.Maui.Controls.resources => 333
	i32 u0xdc5370c5, ; 908: lib_System.Web.HttpUtility.dll.so => 156
	i32 u0xdc68940c, ; 909: zh-Hant/Microsoft.Maui.Controls.resources.dll => 349
	i32 u0xdc96bdf5, ; 910: System.Net.WebProxy.dll => 81
	i32 u0xdcefb51d, ; 911: Xamarin.AndroidX.Core.Core.Ktx.dll => 243
	i32 u0xdd864306, ; 912: System.Runtime.Intrinsics => 111
	i32 u0xdda814c6, ; 913: Xamarin.AndroidX.Annotation => 226
	i32 u0xdddc4e11, ; 914: Microsoft.Extensions.Configuration.Json.dll => 190
	i32 u0xde068c70, ; 915: Xamarin.AndroidX.Navigation.Common.dll => 272
	i32 u0xde7354ab, ; 916: System.Net.NameResolution => 69
	i32 u0xde7513c0, ; 917: Microsoft.AspNetCore.Metadata.dll => 185
	i32 u0xdecad304, ; 918: System.Net.Http.Json.dll => 65
	i32 u0xdf1b1ecd, ; 919: lib_System.ServiceProcess.dll.so => 135
	i32 u0xdf6f3870, ; 920: System.Diagnostics.DiagnosticSource => 27
	i32 u0xdf9a7f42, ; 921: System.Xml.XPath => 164
	i32 u0xdfca27bc, ; 922: SQLitePCLRaw.provider.e_sqlite3 => 219
	i32 u0xdfd65a5d, ; 923: lib_System.Diagnostics.Tracing.dll.so => 34
	i32 u0xe005025e, ; 924: Microsoft.Extensions.Configuration.FileExtensions => 189
	i32 u0xe05b6245, ; 925: Xamarin.AndroidX.Lifecycle.Runtime.Ktx.Android.dll => 265
	i32 u0xe12f62fc, ; 926: lib_System.Threading.ThreadPool.dll.so => 150
	i32 u0xe13414bb, ; 927: lib-hu-Microsoft.Maui.Controls.resources.dll.so => 328
	i32 u0xe1a41194, ; 928: lib_System.Xml.XDocument.dll.so => 162
	i32 u0xe1ae15d6, ; 929: Xamarin.AndroidX.Collection => 235
	i32 u0xe1eea3e4, ; 930: lib_System.IO.Compression.ZipFile.dll.so => 45
	i32 u0xe1f0a5d8, ; 931: lib_Xamarin.AndroidX.ViewPager.dll.so => 294
	i32 u0xe2098b0b, ; 932: System.Collections.NonGeneric => 10
	i32 u0xe250cda6, ; 933: lib_Microsoft.Extensions.Logging.dll.so => 201
	i32 u0xe2513246, ; 934: lib_System.Runtime.Numerics.dll.so => 113
	i32 u0xe2a3f2e8, ; 935: System.Collections.Specialized.dll => 11
	i32 u0xe34ee011, ; 936: lib_System.IO.Pipelines.dll.so => 54
	i32 u0xe3774f52, ; 937: lib_System.IO.MemoryMappedFiles.dll.so => 53
	i32 u0xe3a54a09, ; 938: System.Net.WebProxy => 81
	i32 u0xe3c7860c, ; 939: lib_System.Security.Claims.dll.so => 121
	i32 u0xe3df9d2b, ; 940: System.Security.Cryptography.dll => 129
	i32 u0xe4436460, ; 941: System.Numerics.dll => 86
	i32 u0xe4fab729, ; 942: Microsoft.Extensions.DependencyInjection.Abstractions.dll => 192
	i32 u0xe52378b9, ; 943: System.Net.Mail.dll => 68
	i32 u0xe56ef253, ; 944: System.Runtime.InteropServices.dll => 110
	i32 u0xe625b819, ; 945: lib_Xamarin.AndroidX.CardView.dll.so => 234
	i32 u0xe6b14171, ; 946: System.Net.HttpListener.dll => 67
	i32 u0xe6ca3640, ; 947: lib_Xamarin.AndroidX.Collection.Ktx.dll.so => 237
	i32 u0xe6e179fa, ; 948: System.Security.Principal => 131
	i32 u0xe6e8f547, ; 949: lib_Microsoft.Extensions.Diagnostics.Abstractions.dll.so => 194
	i32 u0xe6f98713, ; 950: System.Security.Cryptography.Encoding.dll => 125
	i32 u0xe70c9739, ; 951: SQLite-net => 215
	i32 u0xe797fcc1, ; 952: System.Net.WebHeaderCollection.dll => 80
	i32 u0xe79e77a6, ; 953: Xamarin.AndroidX.Transition.dll => 290
	i32 u0xe7c9e2bd, ; 954: Xamarin.AndroidX.ProfileInstaller.ProfileInstaller => 278
	i32 u0xe7dc15ff, ; 955: zh-Hans/Microsoft.Maui.Controls.resources.dll => 348
	i32 u0xe839deed, ; 956: System.Collections.Concurrent.dll => 8
	i32 u0xe843daa0, ; 957: Xamarin.AndroidX.Core.dll => 242
	i32 u0xe89260c1, ; 958: Microsoft.VisualBasic.Core.dll => 2
	i32 u0xe90fdb70, ; 959: Xamarin.AndroidX.Collection.Jvm => 236
	i32 u0xe92ace5f, ; 960: lib_System.Linq.Parallel.dll.so => 61
	i32 u0xe97d0db9, ; 961: lib_System.IO.Hashing.dll.so => 176
	i32 u0xe99f7d24, ; 962: lib-tr-Microsoft.Maui.Controls.resources.dll.so => 344
	i32 u0xe9b2d35e, ; 963: System.IO.Compression.FileSystem.dll => 44
	i32 u0xe9b630ed, ; 964: Xamarin.AndroidX.VersionedParcelable.dll => 293
	i32 u0xea0092d6, ; 965: lib_System.Threading.Tasks.Extensions.dll.so => 146
	i32 u0xea213423, ; 966: System.Xml.ReaderWriter => 160
	i32 u0xea4780ec, ; 967: System.Security.Principal.dll => 131
	i32 u0xea4fb52e, ; 968: Xamarin.AndroidX.Navigation.UI => 277
	i32 u0xeab81858, ; 969: lib_Microsoft.Maui.Essentials.dll.so => 212
	i32 u0xeaf244cc, ; 970: lib_System.IO.Pipes.AccessControl.dll.so => 55
	i32 u0xeaf598f6, ; 971: lib_Microsoft.Extensions.Logging.Abstractions.dll.so => 202
	i32 u0xeb2ecede, ; 972: System.Data.DataSetExtensions.dll => 23
	i32 u0xeb5560c9, ; 973: lib_System.Runtime.InteropServices.RuntimeInformation.dll.so => 109
	i32 u0xebac8bfe, ; 974: System.Text.Encoding.CodePages => 136
	i32 u0xebb0254b, ; 975: lib_System.Net.NetworkInformation.dll.so => 70
	i32 u0xebc66336, ; 976: Xamarin.AndroidX.AppCompat.dll => 229
	i32 u0xec05582d, ; 977: Xamarin.AndroidX.Lifecycle.Process => 261
	i32 u0xec7623e9, ; 978: Xamarin.GooglePlayServices.Location => 306
	i32 u0xeca1adaf, ; 979: Xamarin.GooglePlayServices.Tasks.dll => 307
	i32 u0xed055aad, ; 980: lib_Microsoft.Extensions.Configuration.Json.dll.so => 190
	i32 u0xed1090ae, ; 981: lib_System.Net.Primitives.dll.so => 72
	i32 u0xed409aea, ; 982: th/Microsoft.Maui.Controls.resources.dll => 343
	i32 u0xed96d41f, ; 983: lib_Xamarin.AndroidX.CoordinatorLayout.dll.so => 241
	i32 u0xedadd6e2, ; 984: he/Microsoft.Maui.Controls.resources.dll => 325
	i32 u0xedf6669b, ; 985: lib_System.Drawing.dll.so => 36
	i32 u0xee9f991d, ; 986: System.Diagnostics.Process.dll => 29
	i32 u0xeeefb9c8, ; 987: lib_System.Dynamic.Runtime.dll.so => 37
	i32 u0xef5e8475, ; 988: Xamarin.AndroidX.Annotation.Jvm.dll => 228
	i32 u0xefd01a89, ; 989: System.IO.Pipelines => 54
	i32 u0xeff49a63, ; 990: System.Memory => 64
	i32 u0xeff49c4a, ; 991: lib_System.Text.Encoding.Extensions.dll.so => 137
	i32 u0xf09122fc, ; 992: lib_System.IO.IsolatedStorage.dll.so => 52
	i32 u0xf121f953, ; 993: lib_Xamarin.AndroidX.Lifecycle.LiveData.Core.dll.so => 259
	i32 u0xf1304331, ; 994: Microsoft.Maui.Controls.Xaml.dll => 210
	i32 u0xf15cb56d, ; 995: Xamarin.KotlinX.Serialization.Core => 314
	i32 u0xf1676aaa, ; 996: lib-da-Microsoft.Maui.Controls.resources.dll.so => 319
	i32 u0xf1ad867b, ; 997: System.Reflection.Emit.ILGeneration => 93
	i32 u0xf27f60d1, ; 998: System.Private.Xml.Linq.dll => 90
	i32 u0xf29c5384, ; 999: id/Microsoft.Maui.Controls.resources => 329
	i32 u0xf2cd3649, ; 1000: lib_Microsoft.JSInterop.dll.so => 208
	i32 u0xf2ce3c98, ; 1001: System.Threading.dll => 152
	i32 u0xf2dd3fc4, ; 1002: lib-ja-Microsoft.Maui.Controls.resources.dll.so => 331
	i32 u0xf3201983, ; 1003: Microsoft.Extensions.Hosting.Abstractions.dll => 200
	i32 u0xf323e0a6, ; 1004: lib_Xamarin.Kotlin.StdLib.dll.so => 310
	i32 u0xf33c42ef, ; 1005: lib_Xamarin.AndroidX.VectorDrawable.Animated.dll.so => 292
	i32 u0xf3a16066, ; 1006: lib_Xamarin.AndroidX.Lifecycle.ViewModel.dll.so => 266
	i32 u0xf40add04, ; 1007: Microsoft.Maui.Essentials.dll => 212
	i32 u0xf42589bc, ; 1008: lib_System.Security.Cryptography.X509Certificates.dll.so => 128
	i32 u0xf45985cf, ; 1009: System.Drawing.dll => 36
	i32 u0xf462c30d, ; 1010: System.Private.Uri => 89
	i32 u0xf479582c, ; 1011: Xamarin.AndroidX.Emoji2 => 250
	i32 u0xf47b0a29, ; 1012: lib_System.Configuration.dll.so => 19
	i32 u0xf48143e5, ; 1013: pt/Microsoft.Maui.Controls.resources.dll => 338
	i32 u0xf5185c24, ; 1014: lib-pt-Microsoft.Maui.Controls.resources.dll.so => 338
	i32 u0xf53cb11d, ; 1015: lib_System.Net.Security.dll.so => 75
	i32 u0xf554c79b, ; 1016: lib_System.Linq.AsyncEnumerable.dll.so => 59
	i32 u0xf5861a4f, ; 1017: pl/Microsoft.Maui.Controls.resources => 336
	i32 u0xf5e94e90, ; 1018: ms/Microsoft.Maui.Controls.resources.dll => 333
	i32 u0xf5f4f1f0, ; 1019: Microsoft.Extensions.DependencyInjection => 191
	i32 u0xf5fdf056, ; 1020: lib_Microsoft.Extensions.DependencyInjection.dll.so => 191
	i32 u0xf60736e2, ; 1021: System.IO.FileSystem.Watcher => 50
	i32 u0xf6318da0, ; 1022: System.AppContext => 6
	i32 u0xf73be021, ; 1023: System.Reflection.Emit.ILGeneration.dll => 93
	i32 u0xf76edc75, ; 1024: System.Core => 21
	i32 u0xf7e95c85, ; 1025: System.Xml.XmlSerializer => 166
	i32 u0xf807b767, ; 1026: System.Reflection.TypeExtensions => 99
	i32 u0xf83dd773, ; 1027: System.IO.FileSystem.Watcher.dll => 50
	i32 u0xf86129d4, ; 1028: lib-sv-Microsoft.Maui.Controls.resources.dll.so => 342
	i32 u0xf93ba7d4, ; 1029: System.Runtime.Serialization.Primitives => 116
	i32 u0xf94a8f86, ; 1030: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.dll => 269
	i32 u0xf97c5a99, ; 1031: System.Security => 133
	i32 u0xf99dd9b9, ; 1032: lib_Microsoft.AspNetCore.Components.WebView.dll.so => 183
	i32 u0xf9be026d, ; 1033: lib_SQLitePCLRaw.core.dll.so => 217
	i32 u0xfa21f6af, ; 1034: System.Net.WebClient.dll => 79
	i32 u0xfa50891f, ; 1035: lib_System.Linq.dll.so => 63
	i32 u0xfa6ae1e2, ; 1036: lib_Xamarin.AndroidX.Annotation.dll.so => 226
	i32 u0xfac98279, ; 1037: Xamarin.AndroidX.SavedState.SavedState.Android => 282
	i32 u0xfb0af295, ; 1038: lib-zh-HK-Microsoft.Maui.Controls.resources.dll.so => 347
	i32 u0xfb1dad5d, ; 1039: System.Diagnostics.DiagnosticSource.dll => 27
	i32 u0xfbc4b67c, ; 1040: lib_System.IO.Compression.Brotli.dll.so => 43
	i32 u0xfc5f7d36, ; 1041: pt/Microsoft.Maui.Controls.resources => 338
	i32 u0xfdaee526, ; 1042: Xamarin.AndroidX.Core.Core.Ktx => 243
	i32 u0xfdd1b433, ; 1043: Xamarin.AndroidX.Lifecycle.ViewModel.Ktx => 268
	i32 u0xfdf2741f, ; 1044: System.Buffers => 7
	i32 u0xfe42d509, ; 1045: lib_Xamarin.AndroidX.Security.SecurityCrypto.dll.so => 284
	i32 u0xfea12dee, ; 1046: Microsoft.Maui.Controls.dll => 209
	i32 u0xfecef6ea, ; 1047: System.Runtime.Numerics => 113
	i32 u0xff6b9aa3, ; 1048: lib_Xamarin.AndroidX.SavedState.SavedState.Android.dll.so => 282
	i32 u0xff912ee3, ; 1049: lib_System.Xml.Serialization.dll.so => 161
	i32 u0xffd4917f, ; 1050: Xamarin.AndroidX.Lifecycle.ViewModelSavedState => 269
	i32 u0xfffb240a, ; 1051: Microsoft.Extensions.FileProviders.Embedded => 197
	i32 u0xfffce3e8 ; 1052: Xamarin.AndroidX.ExifInterface.dll => 252
], align 4

@assembly_image_cache_indices = dso_local local_unnamed_addr constant [1053 x i32] [
	i32 70, i32 74, i32 69, i32 271, i32 166, i32 111, i32 192, i32 0,
	i32 59, i32 262, i32 303, i32 48, i32 83, i32 345, i32 149, i32 211,
	i32 317, i32 30, i32 127, i32 213, i32 105, i32 10, i32 194, i32 285,
	i32 76, i32 62, i32 276, i32 347, i32 303, i32 68, i32 110, i32 273,
	i32 285, i32 143, i32 31, i32 80, i32 127, i32 13, i32 238, i32 235,
	i32 224, i32 135, i32 287, i32 288, i32 346, i32 299, i32 155, i32 163,
	i32 65, i32 336, i32 346, i32 77, i32 347, i32 18, i32 233, i32 142,
	i32 44, i32 26, i32 193, i32 203, i32 1, i32 244, i32 246, i32 61,
	i32 42, i32 142, i32 334, i32 94, i32 132, i32 220, i32 214, i32 180,
	i32 239, i32 151, i32 258, i32 255, i32 318, i32 23, i32 341, i32 55,
	i32 71, i32 224, i32 86, i32 301, i32 119, i32 331, i32 256, i32 218,
	i32 13, i32 330, i32 318, i32 134, i32 186, i32 112, i32 56, i32 153,
	i32 77, i32 149, i32 176, i32 64, i32 150, i32 280, i32 350, i32 169,
	i32 263, i32 125, i32 342, i32 240, i32 12, i32 253, i32 128, i32 156,
	i32 264, i32 174, i32 116, i32 170, i32 172, i32 168, i32 255, i32 89,
	i32 285, i32 118, i32 87, i32 329, i32 323, i32 214, i32 206, i32 127,
	i32 6, i32 154, i32 326, i32 62, i32 201, i32 51, i32 106, i32 117,
	i32 40, i32 309, i32 300, i32 244, i32 197, i32 123, i32 337, i32 178,
	i32 134, i32 11, i32 52, i32 21, i32 44, i32 78, i32 122, i32 263,
	i32 246, i32 198, i32 251, i32 247, i32 96, i32 320, i32 84, i32 139,
	i32 293, i32 22, i32 231, i32 8, i32 51, i32 337, i32 75, i32 317,
	i32 159, i32 311, i32 245, i32 158, i32 167, i32 95, i32 308, i32 45,
	i32 332, i32 320, i32 112, i32 205, i32 133, i32 132, i32 216, i32 25,
	i32 221, i32 165, i32 74, i32 56, i32 46, i32 184, i32 100, i32 204,
	i32 92, i32 247, i32 184, i32 22, i32 260, i32 149, i32 89, i32 43,
	i32 164, i32 73, i32 248, i32 316, i32 3, i32 42, i32 65, i32 176,
	i32 56, i32 218, i32 302, i32 16, i32 58, i32 305, i32 53, i32 154,
	i32 41, i32 344, i32 303, i32 14, i32 267, i32 251, i32 205, i32 108,
	i32 257, i32 298, i32 170, i32 301, i32 256, i32 34, i32 162, i32 311,
	i32 88, i32 32, i32 249, i32 12, i32 348, i32 145, i32 51, i32 322,
	i32 199, i32 57, i32 207, i32 281, i32 36, i32 192, i32 319, i32 302,
	i32 229, i32 35, i32 255, i32 60, i32 99, i32 194, i32 266, i32 12,
	i32 101, i32 206, i32 261, i32 178, i32 17, i32 310, i32 168, i32 189,
	i32 200, i32 95, i32 139, i32 223, i32 264, i32 203, i32 343, i32 126,
	i32 17, i32 81, i32 85, i32 296, i32 66, i32 88, i32 76, i32 158,
	i32 157, i32 195, i32 292, i32 275, i32 323, i32 144, i32 103, i32 336,
	i32 231, i32 29, i32 52, i32 235, i32 151, i32 182, i32 334, i32 200,
	i32 326, i32 236, i32 309, i32 5, i32 213, i32 315, i32 286, i32 312,
	i32 90, i32 291, i32 117, i32 237, i32 311, i32 228, i32 217, i32 248,
	i32 278, i32 88, i32 273, i32 207, i32 273, i32 296, i32 63, i32 115,
	i32 327, i32 317, i32 270, i32 58, i32 281, i32 102, i32 177, i32 50,
	i32 19, i32 241, i32 270, i32 114, i32 104, i32 32, i32 3, i32 105,
	i32 86, i32 107, i32 301, i32 257, i32 73, i32 4, i32 267, i32 38,
	i32 32, i32 196, i32 57, i32 106, i32 75, i32 9, i32 126, i32 46,
	i32 230, i32 206, i32 9, i32 43, i32 4, i32 283, i32 326, i32 35,
	i32 321, i32 199, i32 214, i32 31, i32 233, i32 141, i32 95, i32 184,
	i32 96, i32 341, i32 324, i32 289, i32 49, i32 145, i32 115, i32 315,
	i32 144, i32 2, i32 342, i32 16, i32 179, i32 349, i32 118, i32 193,
	i32 302, i32 161, i32 79, i32 82, i32 39, i32 271, i32 37, i32 295,
	i32 232, i32 190, i32 251, i32 245, i32 66, i32 141, i32 15, i32 46,
	i32 160, i32 169, i32 183, i32 119, i32 313, i32 288, i32 299, i32 239,
	i32 48, i32 72, i32 83, i32 309, i32 129, i32 97, i32 124, i32 153,
	i32 26, i32 218, i32 120, i32 260, i32 100, i32 28, i32 234, i32 105,
	i32 339, i32 153, i32 54, i32 173, i32 4, i32 101, i32 182, i32 38,
	i32 349, i32 33, i32 80, i32 96, i32 287, i32 201, i32 108, i32 298,
	i32 21, i32 41, i32 229, i32 174, i32 106, i32 253, i32 152, i32 324,
	i32 195, i32 271, i32 334, i32 304, i32 310, i32 299, i32 312, i32 277,
	i32 2, i32 328, i32 137, i32 114, i32 293, i32 202, i32 345, i32 221,
	i32 60, i32 98, i32 239, i32 39, i32 232, i32 348, i32 25, i32 97,
	i32 92, i32 102, i32 305, i32 10, i32 0, i32 230, i32 175, i32 219,
	i32 90, i32 49, i32 64, i32 79, i32 207, i32 103, i32 331, i32 284,
	i32 186, i32 47, i32 76, i32 223, i32 189, i32 7, i32 327, i32 84,
	i32 266, i32 316, i32 227, i32 220, i32 325, i32 330, i32 91, i32 188,
	i32 259, i32 197, i32 158, i32 350, i32 59, i32 254, i32 33, i32 198,
	i32 115, i32 119, i32 67, i32 85, i32 219, i32 138, i32 20, i32 304,
	i32 11, i32 166, i32 136, i32 332, i32 3, i32 28, i32 332, i32 333,
	i32 300, i32 211, i32 114, i32 339, i32 102, i32 27, i32 15, i32 204,
	i32 7, i32 0, i32 202, i32 87, i32 60, i32 73, i32 30, i32 313,
	i32 66, i32 292, i32 147, i32 83, i32 340, i32 161, i32 297, i32 41,
	i32 268, i32 209, i32 120, i32 187, i32 222, i32 324, i32 330, i32 279,
	i32 335, i32 171, i32 343, i32 263, i32 297, i32 134, i32 78, i32 216,
	i32 68, i32 177, i32 226, i32 306, i32 147, i32 109, i32 155, i32 323,
	i32 20, i32 72, i32 215, i32 258, i32 160, i32 344, i32 186, i32 148,
	i32 124, i32 274, i32 316, i32 130, i32 199, i32 180, i32 298, i32 156,
	i32 250, i32 157, i32 91, i32 180, i32 297, i32 145, i32 335, i32 237,
	i32 98, i32 253, i32 20, i32 14, i32 208, i32 286, i32 138, i32 78,
	i32 61, i32 216, i32 240, i32 171, i32 260, i32 172, i32 209, i32 15,
	i32 77, i32 140, i32 262, i32 6, i32 329, i32 225, i32 23, i32 262,
	i32 281, i32 341, i32 220, i32 210, i32 179, i32 94, i32 1, i32 307,
	i32 139, i32 265, i32 264, i32 291, i32 137, i32 71, i32 181, i32 150,
	i32 195, i32 116, i32 313, i32 25, i32 254, i32 203, i32 91, i32 99,
	i32 245, i32 249, i32 277, i32 31, i32 45, i32 147, i32 258, i32 269,
	i32 222, i32 112, i32 162, i32 35, i32 312, i32 110, i32 22, i32 117,
	i32 183, i32 58, i32 141, i32 288, i32 148, i32 121, i32 123, i32 242,
	i32 113, i32 322, i32 224, i32 143, i32 179, i32 230, i32 55, i32 82,
	i32 108, i32 270, i32 210, i32 8, i32 211, i32 123, i32 136, i32 267,
	i32 308, i32 296, i32 155, i32 294, i32 280, i32 257, i32 9, i32 221,
	i32 48, i32 254, i32 69, i32 289, i32 213, i32 345, i32 163, i32 322,
	i32 275, i32 241, i32 5, i32 167, i32 129, i32 135, i32 280, i32 165,
	i32 335, i32 185, i32 289, i32 268, i32 304, i32 144, i32 294, i32 42,
	i32 290, i32 321, i32 173, i32 212, i32 225, i32 181, i32 300, i32 40,
	i32 315, i32 340, i32 252, i32 84, i32 182, i32 57, i32 37, i32 130,
	i32 100, i32 142, i32 170, i32 177, i32 198, i32 314, i32 295, i32 85,
	i32 227, i32 204, i32 101, i32 26, i32 30, i32 163, i32 283, i32 18,
	i32 185, i32 130, i32 205, i32 276, i32 122, i32 248, i32 159, i32 265,
	i32 284, i32 318, i32 222, i32 71, i32 261, i32 286, i32 193, i32 169,
	i32 350, i32 107, i32 196, i32 283, i32 272, i32 307, i32 173, i32 174,
	i32 16, i32 295, i32 291, i32 148, i32 328, i32 40, i32 128, i32 121,
	i32 38, i32 118, i32 47, i32 146, i32 87, i32 120, i32 34, i32 178,
	i32 98, i32 53, i32 236, i32 97, i32 272, i32 188, i32 274, i32 131,
	i32 104, i32 132, i32 157, i32 24, i32 165, i32 152, i32 107, i32 305,
	i32 256, i32 244, i32 92, i32 240, i32 282, i32 234, i32 62, i32 146,
	i32 93, i32 103, i32 5, i32 13, i32 124, i32 215, i32 125, i32 122,
	i32 138, i32 28, i32 187, i32 74, i32 246, i32 24, i32 24, i32 232,
	i32 278, i32 275, i32 290, i32 243, i32 18, i32 140, i32 217, i32 225,
	i32 242, i32 172, i32 33, i32 276, i32 279, i32 104, i32 126, i32 247,
	i32 196, i32 94, i32 188, i32 191, i32 167, i32 171, i32 249, i32 39,
	i32 250, i32 29, i32 327, i32 181, i32 17, i32 175, i32 340, i32 287,
	i32 140, i32 154, i32 238, i32 306, i32 208, i32 159, i32 133, i32 19,
	i32 67, i32 308, i32 346, i32 168, i32 111, i32 151, i32 1, i32 231,
	i32 252, i32 47, i32 164, i32 339, i32 320, i32 223, i32 82, i32 63,
	i32 319, i32 109, i32 143, i32 227, i32 279, i32 49, i32 259, i32 314,
	i32 274, i32 14, i32 337, i32 321, i32 187, i32 70, i32 325, i32 228,
	i32 175, i32 233, i32 238, i32 333, i32 156, i32 349, i32 81, i32 243,
	i32 111, i32 226, i32 190, i32 272, i32 69, i32 185, i32 65, i32 135,
	i32 27, i32 164, i32 219, i32 34, i32 189, i32 265, i32 150, i32 328,
	i32 162, i32 235, i32 45, i32 294, i32 10, i32 201, i32 113, i32 11,
	i32 54, i32 53, i32 81, i32 121, i32 129, i32 86, i32 192, i32 68,
	i32 110, i32 234, i32 67, i32 237, i32 131, i32 194, i32 125, i32 215,
	i32 80, i32 290, i32 278, i32 348, i32 8, i32 242, i32 2, i32 236,
	i32 61, i32 176, i32 344, i32 44, i32 293, i32 146, i32 160, i32 131,
	i32 277, i32 212, i32 55, i32 202, i32 23, i32 109, i32 136, i32 70,
	i32 229, i32 261, i32 306, i32 307, i32 190, i32 72, i32 343, i32 241,
	i32 325, i32 36, i32 29, i32 37, i32 228, i32 54, i32 64, i32 137,
	i32 52, i32 259, i32 210, i32 314, i32 319, i32 93, i32 90, i32 329,
	i32 208, i32 152, i32 331, i32 200, i32 310, i32 292, i32 266, i32 212,
	i32 128, i32 36, i32 89, i32 250, i32 19, i32 338, i32 338, i32 75,
	i32 59, i32 336, i32 333, i32 191, i32 191, i32 50, i32 6, i32 93,
	i32 21, i32 166, i32 99, i32 50, i32 342, i32 116, i32 269, i32 133,
	i32 183, i32 217, i32 79, i32 63, i32 226, i32 282, i32 347, i32 27,
	i32 43, i32 338, i32 243, i32 268, i32 7, i32 284, i32 209, i32 113,
	i32 282, i32 161, i32 269, i32 197, i32 252
], align 4

@marshal_methods_number_of_classes = dso_local local_unnamed_addr constant i32 0, align 4

@marshal_methods_class_cache = dso_local local_unnamed_addr global [0 x %struct.MarshalMethodsManagedClass] zeroinitializer, align 4

; Names of classes in which marshal methods reside
@mm_class_names = dso_local local_unnamed_addr constant [0 x ptr] zeroinitializer, align 4

@mm_method_names = dso_local local_unnamed_addr constant [1 x %struct.MarshalMethodName] [
	%struct.MarshalMethodName {
		i64 u0x0000000000000000, ; name: 
		ptr @.MarshalMethodName.0_name; char* name
	} ; 0
], align 8

; get_function_pointer (uint32_t mono_image_index, uint32_t class_index, uint32_t method_token, void*& target_ptr)
@get_function_pointer = internal dso_local unnamed_addr global ptr null, align 4

; Functions

; Function attributes: memory(write, argmem: none, inaccessiblemem: none) "min-legal-vector-width"="0" mustprogress "no-trapping-math"="true" nofree norecurse nosync nounwind "stack-protector-buffer-size"="8" uwtable willreturn
define void @xamarin_app_init(ptr nocapture noundef readnone %env, ptr noundef %fn) local_unnamed_addr #0
{
	%fnIsNull = icmp eq ptr %fn, null
	br i1 %fnIsNull, label %1, label %2

1: ; preds = %0
	%putsResult = call noundef i32 @puts(ptr @.mm.0)
	call void @abort()
	unreachable 

2: ; preds = %1, %0
	store ptr %fn, ptr @get_function_pointer, align 4, !tbaa !3
	ret void
}

; Strings
@.mm.0 = private unnamed_addr constant [40 x i8] c"get_function_pointer MUST be specified\0A\00", align 1

;MarshalMethodName
@.MarshalMethodName.0_name = private unnamed_addr constant [1 x i8] c"\00", align 1

; External functions

; Function attributes: "no-trapping-math"="true" noreturn nounwind "stack-protector-buffer-size"="8"
declare void @abort() local_unnamed_addr #2

; Function attributes: nofree nounwind
declare noundef i32 @puts(ptr noundef) local_unnamed_addr #1
attributes #0 = { memory(write, argmem: none, inaccessiblemem: none) "min-legal-vector-width"="0" mustprogress "no-trapping-math"="true" nofree norecurse nosync nounwind "stack-protector-buffer-size"="8" "stackrealign" "target-cpu"="i686" "target-features"="+cx8,+mmx,+sse,+sse2,+sse3,+ssse3,+x87" "tune-cpu"="generic" uwtable willreturn }
attributes #1 = { nofree nounwind }
attributes #2 = { "no-trapping-math"="true" noreturn nounwind "stack-protector-buffer-size"="8" "stackrealign" "target-cpu"="i686" "target-features"="+cx8,+mmx,+sse,+sse2,+sse3,+ssse3,+x87" "tune-cpu"="generic" }

; Metadata
!llvm.module.flags = !{!0, !1, !7}
!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!llvm.ident = !{!2}
!2 = !{!".NET for Android remotes/origin/darc-release/10.0.1xx-fce6efd9-cc42-423a-a4db-1a5ebe0f4ee4 @ 350a375fc202f0072ac4191624986d8c642b93fa"}
!3 = !{!4, !4, i64 0}
!4 = !{!"any pointer", !5, i64 0}
!5 = !{!"omnipotent char", !6, i64 0}
!6 = !{!"Simple C++ TBAA"}
!7 = !{i32 1, !"NumRegisterParameters", i32 0}
