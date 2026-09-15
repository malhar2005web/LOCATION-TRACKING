; ModuleID = 'compressed_assemblies.armeabi-v7a.ll'
source_filename = "compressed_assemblies.armeabi-v7a.ll"
target datalayout = "e-m:e-p:32:32-Fi8-i64:64-v128:64:128-a:0:32-n32-S64"
target triple = "armv7-unknown-linux-android21"

%struct.CompressedAssemblyDescriptor = type {
	i32, ; uint32_t uncompressed_file_size
	i1, ; bool loaded
	i32 ; uint32_t buffer_offset
}

@compressed_assembly_count = dso_local local_unnamed_addr constant i32 351, align 4

@compressed_assembly_descriptors = dso_local local_unnamed_addr global [351 x %struct.CompressedAssemblyDescriptor] [
	%struct.CompressedAssemblyDescriptor {
		i32 376832, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 0; uint32_t buffer_offset
	}, ; 0: LOCATION_TRACKING
	%struct.CompressedAssemblyDescriptor {
		i32 174128, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 376832; uint32_t buffer_offset
	}, ; 1: GoogleGson
	%struct.CompressedAssemblyDescriptor {
		i32 56120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 550960; uint32_t buffer_offset
	}, ; 2: Microsoft.AspNetCore.Authorization
	%struct.CompressedAssemblyDescriptor {
		i32 399632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 607080; uint32_t buffer_offset
	}, ; 3: Microsoft.AspNetCore.Components
	%struct.CompressedAssemblyDescriptor {
		i32 48392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1006712; uint32_t buffer_offset
	}, ; 4: Microsoft.AspNetCore.Components.Forms
	%struct.CompressedAssemblyDescriptor {
		i32 189744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1055104; uint32_t buffer_offset
	}, ; 5: Microsoft.AspNetCore.Components.Web
	%struct.CompressedAssemblyDescriptor {
		i32 114448, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1244848; uint32_t buffer_offset
	}, ; 6: Microsoft.AspNetCore.Components.WebView
	%struct.CompressedAssemblyDescriptor {
		i32 70456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1359296; uint32_t buffer_offset
	}, ; 7: Microsoft.AspNetCore.Components.WebView.Maui
	%struct.CompressedAssemblyDescriptor {
		i32 16696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1429752; uint32_t buffer_offset
	}, ; 8: Microsoft.AspNetCore.Metadata
	%struct.CompressedAssemblyDescriptor {
		i32 45320, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1446448; uint32_t buffer_offset
	}, ; 9: Microsoft.Extensions.Configuration
	%struct.CompressedAssemblyDescriptor {
		i32 28984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1491768; uint32_t buffer_offset
	}, ; 10: Microsoft.Extensions.Configuration.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 43792, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1520752; uint32_t buffer_offset
	}, ; 11: Microsoft.Extensions.Configuration.Binder
	%struct.CompressedAssemblyDescriptor {
		i32 28976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1564544; uint32_t buffer_offset
	}, ; 12: Microsoft.Extensions.Configuration.FileExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 28472, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1593520; uint32_t buffer_offset
	}, ; 13: Microsoft.Extensions.Configuration.Json
	%struct.CompressedAssemblyDescriptor {
		i32 96008, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1621992; uint32_t buffer_offset
	}, ; 14: Microsoft.Extensions.DependencyInjection
	%struct.CompressedAssemblyDescriptor {
		i32 66312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1718000; uint32_t buffer_offset
	}, ; 15: Microsoft.Extensions.DependencyInjection.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 36624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1784312; uint32_t buffer_offset
	}, ; 16: Microsoft.Extensions.Diagnostics
	%struct.CompressedAssemblyDescriptor {
		i32 31504, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1820936; uint32_t buffer_offset
	}, ; 17: Microsoft.Extensions.Diagnostics.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 23864, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1852440; uint32_t buffer_offset
	}, ; 18: Microsoft.Extensions.FileProviders.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 19208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1876304; uint32_t buffer_offset
	}, ; 19: Microsoft.Extensions.FileProviders.Composite
	%struct.CompressedAssemblyDescriptor {
		i32 34104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1895512; uint32_t buffer_offset
	}, ; 20: Microsoft.Extensions.FileProviders.Embedded
	%struct.CompressedAssemblyDescriptor {
		i32 45840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1929616; uint32_t buffer_offset
	}, ; 21: Microsoft.Extensions.FileProviders.Physical
	%struct.CompressedAssemblyDescriptor {
		i32 48400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1975456; uint32_t buffer_offset
	}, ; 22: Microsoft.Extensions.FileSystemGlobbing
	%struct.CompressedAssemblyDescriptor {
		i32 54536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2023856; uint32_t buffer_offset
	}, ; 23: Microsoft.Extensions.Hosting.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 52016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2078392; uint32_t buffer_offset
	}, ; 24: Microsoft.Extensions.Logging
	%struct.CompressedAssemblyDescriptor {
		i32 67344, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2130408; uint32_t buffer_offset
	}, ; 25: Microsoft.Extensions.Logging.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 20240, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2197752; uint32_t buffer_offset
	}, ; 26: Microsoft.Extensions.Logging.Debug
	%struct.CompressedAssemblyDescriptor {
		i32 65848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2217992; uint32_t buffer_offset
	}, ; 27: Microsoft.Extensions.Options
	%struct.CompressedAssemblyDescriptor {
		i32 22280, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2283840; uint32_t buffer_offset
	}, ; 28: Microsoft.Extensions.Options.ConfigurationExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 45328, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2306120; uint32_t buffer_offset
	}, ; 29: Microsoft.Extensions.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 43784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2351448; uint32_t buffer_offset
	}, ; 30: Microsoft.Extensions.Validation
	%struct.CompressedAssemblyDescriptor {
		i32 75528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2395232; uint32_t buffer_offset
	}, ; 31: Microsoft.JSInterop
	%struct.CompressedAssemblyDescriptor {
		i32 1928504, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2470760; uint32_t buffer_offset
	}, ; 32: Microsoft.Maui.Controls
	%struct.CompressedAssemblyDescriptor {
		i32 135432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 4399264; uint32_t buffer_offset
	}, ; 33: Microsoft.Maui.Controls.Xaml
	%struct.CompressedAssemblyDescriptor {
		i32 875832, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 4534696; uint32_t buffer_offset
	}, ; 34: Microsoft.Maui
	%struct.CompressedAssemblyDescriptor {
		i32 280848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5410528; uint32_t buffer_offset
	}, ; 35: Microsoft.Maui.Essentials
	%struct.CompressedAssemblyDescriptor {
		i32 208696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5691376; uint32_t buffer_offset
	}, ; 36: Microsoft.Maui.Graphics
	%struct.CompressedAssemblyDescriptor {
		i32 74240, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5900072; uint32_t buffer_offset
	}, ; 37: Plugin.LocalNotification
	%struct.CompressedAssemblyDescriptor {
		i32 107520, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5974312; uint32_t buffer_offset
	}, ; 38: SQLite-net
	%struct.CompressedAssemblyDescriptor {
		i32 5632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6081832; uint32_t buffer_offset
	}, ; 39: SQLitePCLRaw.batteries_v2
	%struct.CompressedAssemblyDescriptor {
		i32 50688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6087464; uint32_t buffer_offset
	}, ; 40: SQLitePCLRaw.core
	%struct.CompressedAssemblyDescriptor {
		i32 5632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6138152; uint32_t buffer_offset
	}, ; 41: SQLitePCLRaw.lib.e_sqlite3.android
	%struct.CompressedAssemblyDescriptor {
		i32 35840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6143784; uint32_t buffer_offset
	}, ; 42: SQLitePCLRaw.provider.e_sqlite3
	%struct.CompressedAssemblyDescriptor {
		i32 1194040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6179624; uint32_t buffer_offset
	}, ; 43: Xamarin.Android.Glide
	%struct.CompressedAssemblyDescriptor {
		i32 15944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7373664; uint32_t buffer_offset
	}, ; 44: Xamarin.Android.Glide.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 25632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7389608; uint32_t buffer_offset
	}, ; 45: Xamarin.Android.Glide.DiskLruCache
	%struct.CompressedAssemblyDescriptor {
		i32 63032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7415240; uint32_t buffer_offset
	}, ; 46: Xamarin.Android.Glide.GifDecoder
	%struct.CompressedAssemblyDescriptor {
		i32 197688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7478272; uint32_t buffer_offset
	}, ; 47: Xamarin.AndroidX.Activity
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7675960; uint32_t buffer_offset
	}, ; 48: Xamarin.AndroidX.Activity.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 15912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7691888; uint32_t buffer_offset
	}, ; 49: Xamarin.AndroidX.Annotation
	%struct.CompressedAssemblyDescriptor {
		i32 38432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7707800; uint32_t buffer_offset
	}, ; 50: Xamarin.AndroidX.Annotation.Experimental
	%struct.CompressedAssemblyDescriptor {
		i32 215608, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7746232; uint32_t buffer_offset
	}, ; 51: Xamarin.AndroidX.Annotation.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 1305632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7961840; uint32_t buffer_offset
	}, ; 52: Xamarin.AndroidX.AppCompat
	%struct.CompressedAssemblyDescriptor {
		i32 103456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9267472; uint32_t buffer_offset
	}, ; 53: Xamarin.AndroidX.AppCompat.AppCompatResources
	%struct.CompressedAssemblyDescriptor {
		i32 38984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9370928; uint32_t buffer_offset
	}, ; 54: Xamarin.AndroidX.Arch.Core.Common
	%struct.CompressedAssemblyDescriptor {
		i32 28192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9409912; uint32_t buffer_offset
	}, ; 55: Xamarin.AndroidX.Arch.Core.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 411184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9438104; uint32_t buffer_offset
	}, ; 56: Xamarin.AndroidX.Browser
	%struct.CompressedAssemblyDescriptor {
		i32 35400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9849288; uint32_t buffer_offset
	}, ; 57: Xamarin.AndroidX.CardView
	%struct.CompressedAssemblyDescriptor {
		i32 15944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9884688; uint32_t buffer_offset
	}, ; 58: Xamarin.AndroidX.Collection
	%struct.CompressedAssemblyDescriptor {
		i32 628768, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9900632; uint32_t buffer_offset
	}, ; 59: Xamarin.AndroidX.Collection.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10529400; uint32_t buffer_offset
	}, ; 60: Xamarin.AndroidX.Collection.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 36424, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10545304; uint32_t buffer_offset
	}, ; 61: Xamarin.AndroidX.Concurrent.Futures
	%struct.CompressedAssemblyDescriptor {
		i32 752680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10581728; uint32_t buffer_offset
	}, ; 62: Xamarin.AndroidX.ConstraintLayout
	%struct.CompressedAssemblyDescriptor {
		i32 1466936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 11334408; uint32_t buffer_offset
	}, ; 63: Xamarin.AndroidX.ConstraintLayout.Core
	%struct.CompressedAssemblyDescriptor {
		i32 112680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 12801344; uint32_t buffer_offset
	}, ; 64: Xamarin.AndroidX.CoordinatorLayout
	%struct.CompressedAssemblyDescriptor {
		i32 2221568, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 12914024; uint32_t buffer_offset
	}, ; 65: Xamarin.AndroidX.Core
	%struct.CompressedAssemblyDescriptor {
		i32 216608, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15135592; uint32_t buffer_offset
	}, ; 66: Xamarin.AndroidX.Core.Core.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 20016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15352200; uint32_t buffer_offset
	}, ; 67: Xamarin.AndroidX.Core.ViewTree
	%struct.CompressedAssemblyDescriptor {
		i32 64040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15372216; uint32_t buffer_offset
	}, ; 68: Xamarin.AndroidX.CursorAdapter
	%struct.CompressedAssemblyDescriptor {
		i32 74776, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15436256; uint32_t buffer_offset
	}, ; 69: Xamarin.AndroidX.CustomView
	%struct.CompressedAssemblyDescriptor {
		i32 25672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15511032; uint32_t buffer_offset
	}, ; 70: Xamarin.AndroidX.CustomView.PoolingContainer
	%struct.CompressedAssemblyDescriptor {
		i32 67632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15536704; uint32_t buffer_offset
	}, ; 71: Xamarin.AndroidX.DrawerLayout
	%struct.CompressedAssemblyDescriptor {
		i32 73272, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15604336; uint32_t buffer_offset
	}, ; 72: Xamarin.AndroidX.DynamicAnimation
	%struct.CompressedAssemblyDescriptor {
		i32 288816, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15677608; uint32_t buffer_offset
	}, ; 73: Xamarin.AndroidX.Emoji2
	%struct.CompressedAssemblyDescriptor {
		i32 26144, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15966424; uint32_t buffer_offset
	}, ; 74: Xamarin.AndroidX.Emoji2.ViewsHelper
	%struct.CompressedAssemblyDescriptor {
		i32 73288, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15992568; uint32_t buffer_offset
	}, ; 75: Xamarin.AndroidX.ExifInterface
	%struct.CompressedAssemblyDescriptor {
		i32 384544, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16065856; uint32_t buffer_offset
	}, ; 76: Xamarin.AndroidX.Fragment
	%struct.CompressedAssemblyDescriptor {
		i32 27192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16450400; uint32_t buffer_offset
	}, ; 77: Xamarin.AndroidX.Fragment.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 26152, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16477592; uint32_t buffer_offset
	}, ; 78: Xamarin.AndroidX.Interpolator
	%struct.CompressedAssemblyDescriptor {
		i32 16952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16503744; uint32_t buffer_offset
	}, ; 79: Xamarin.AndroidX.Lifecycle.Common
	%struct.CompressedAssemblyDescriptor {
		i32 71200, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16520696; uint32_t buffer_offset
	}, ; 80: Xamarin.AndroidX.Lifecycle.Common.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 39464, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16591896; uint32_t buffer_offset
	}, ; 81: Xamarin.AndroidX.Lifecycle.LiveData
	%struct.CompressedAssemblyDescriptor {
		i32 36936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16631360; uint32_t buffer_offset
	}, ; 82: Xamarin.AndroidX.Lifecycle.LiveData.Core
	%struct.CompressedAssemblyDescriptor {
		i32 16440, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16668296; uint32_t buffer_offset
	}, ; 83: Xamarin.AndroidX.Lifecycle.LiveData.Core.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 22584, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16684736; uint32_t buffer_offset
	}, ; 84: Xamarin.AndroidX.Lifecycle.Process
	%struct.CompressedAssemblyDescriptor {
		i32 15416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16707320; uint32_t buffer_offset
	}, ; 85: Xamarin.AndroidX.Lifecycle.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 54312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16722736; uint32_t buffer_offset
	}, ; 86: Xamarin.AndroidX.Lifecycle.Runtime.Android
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16777048; uint32_t buffer_offset
	}, ; 87: Xamarin.AndroidX.Lifecycle.Runtime.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 16456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16792952; uint32_t buffer_offset
	}, ; 88: Xamarin.AndroidX.Lifecycle.Runtime.Ktx.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16809408; uint32_t buffer_offset
	}, ; 89: Xamarin.AndroidX.Lifecycle.ViewModel
	%struct.CompressedAssemblyDescriptor {
		i32 88632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16826336; uint32_t buffer_offset
	}, ; 90: Xamarin.AndroidX.Lifecycle.ViewModel.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16440, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16914968; uint32_t buffer_offset
	}, ; 91: Xamarin.AndroidX.Lifecycle.ViewModel.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16931408; uint32_t buffer_offset
	}, ; 92: Xamarin.AndroidX.Lifecycle.ViewModelSavedState
	%struct.CompressedAssemblyDescriptor {
		i32 48200, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16947336; uint32_t buffer_offset
	}, ; 93: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.Android
	%struct.CompressedAssemblyDescriptor {
		i32 71720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16995536; uint32_t buffer_offset
	}, ; 94: Xamarin.AndroidX.Loader
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17067256; uint32_t buffer_offset
	}, ; 95: Xamarin.AndroidX.Navigation.Common
	%struct.CompressedAssemblyDescriptor {
		i32 233016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17083160; uint32_t buffer_offset
	}, ; 96: Xamarin.AndroidX.Navigation.Common.Android
	%struct.CompressedAssemblyDescriptor {
		i32 60960, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17316176; uint32_t buffer_offset
	}, ; 97: Xamarin.AndroidX.Navigation.Fragment
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17377136; uint32_t buffer_offset
	}, ; 98: Xamarin.AndroidX.Navigation.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 124984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17393064; uint32_t buffer_offset
	}, ; 99: Xamarin.AndroidX.Navigation.Runtime.Android
	%struct.CompressedAssemblyDescriptor {
		i32 57400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17518048; uint32_t buffer_offset
	}, ; 100: Xamarin.AndroidX.Navigation.UI
	%struct.CompressedAssemblyDescriptor {
		i32 52784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17575448; uint32_t buffer_offset
	}, ; 101: Xamarin.AndroidX.ProfileInstaller.ProfileInstaller
	%struct.CompressedAssemblyDescriptor {
		i32 668712, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17628232; uint32_t buffer_offset
	}, ; 102: Xamarin.AndroidX.RecyclerView
	%struct.CompressedAssemblyDescriptor {
		i32 30792, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18296944; uint32_t buffer_offset
	}, ; 103: Xamarin.AndroidX.ResourceInspection.Annotation
	%struct.CompressedAssemblyDescriptor {
		i32 15912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18327736; uint32_t buffer_offset
	}, ; 104: Xamarin.AndroidX.SavedState
	%struct.CompressedAssemblyDescriptor {
		i32 91688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18343648; uint32_t buffer_offset
	}, ; 105: Xamarin.AndroidX.SavedState.SavedState.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18435336; uint32_t buffer_offset
	}, ; 106: Xamarin.AndroidX.SavedState.SavedState.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 46648, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18451752; uint32_t buffer_offset
	}, ; 107: Xamarin.AndroidX.Security.SecurityCrypto
	%struct.CompressedAssemblyDescriptor {
		i32 50208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18498400; uint32_t buffer_offset
	}, ; 108: Xamarin.AndroidX.SlidingPaneLayout
	%struct.CompressedAssemblyDescriptor {
		i32 31304, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18548608; uint32_t buffer_offset
	}, ; 109: Xamarin.AndroidX.Startup.StartupRuntime
	%struct.CompressedAssemblyDescriptor {
		i32 77856, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18579912; uint32_t buffer_offset
	}, ; 110: Xamarin.AndroidX.SwipeRefreshLayout
	%struct.CompressedAssemblyDescriptor {
		i32 15392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18657768; uint32_t buffer_offset
	}, ; 111: Xamarin.AndroidX.Tracing.Tracing
	%struct.CompressedAssemblyDescriptor {
		i32 24104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18673160; uint32_t buffer_offset
	}, ; 112: Xamarin.AndroidX.Tracing.Tracing.Android
	%struct.CompressedAssemblyDescriptor {
		i32 185392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18697264; uint32_t buffer_offset
	}, ; 113: Xamarin.AndroidX.Transition
	%struct.CompressedAssemblyDescriptor {
		i32 36384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18882656; uint32_t buffer_offset
	}, ; 114: Xamarin.AndroidX.VectorDrawable
	%struct.CompressedAssemblyDescriptor {
		i32 49184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18919040; uint32_t buffer_offset
	}, ; 115: Xamarin.AndroidX.VectorDrawable.Animated
	%struct.CompressedAssemblyDescriptor {
		i32 122936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18968224; uint32_t buffer_offset
	}, ; 116: Xamarin.AndroidX.VersionedParcelable
	%struct.CompressedAssemblyDescriptor {
		i32 96288, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19091160; uint32_t buffer_offset
	}, ; 117: Xamarin.AndroidX.ViewPager
	%struct.CompressedAssemblyDescriptor {
		i32 74784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19187448; uint32_t buffer_offset
	}, ; 118: Xamarin.AndroidX.ViewPager2
	%struct.CompressedAssemblyDescriptor {
		i32 271904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19262232; uint32_t buffer_offset
	}, ; 119: Xamarin.AndroidX.Window
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19534136; uint32_t buffer_offset
	}, ; 120: Xamarin.AndroidX.Window.WindowCore
	%struct.CompressedAssemblyDescriptor {
		i32 35360, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19550040; uint32_t buffer_offset
	}, ; 121: Xamarin.AndroidX.Window.WindowCore.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 2789920, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19585400; uint32_t buffer_offset
	}, ; 122: Xamarin.Google.Android.Material
	%struct.CompressedAssemblyDescriptor {
		i32 102432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 22375320; uint32_t buffer_offset
	}, ; 123: Jsr305Binding
	%struct.CompressedAssemblyDescriptor {
		i32 5886976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 22477752; uint32_t buffer_offset
	}, ; 124: Xamarin.Google.Crypto.Tink.Android
	%struct.CompressedAssemblyDescriptor {
		i32 101944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28364728; uint32_t buffer_offset
	}, ; 125: Xamarin.Google.ErrorProne.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 27192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28466672; uint32_t buffer_offset
	}, ; 126: Xamarin.Google.Guava.ListenableFuture
	%struct.CompressedAssemblyDescriptor {
		i32 738224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28493864; uint32_t buffer_offset
	}, ; 127: Xamarin.GooglePlayServices.Base
	%struct.CompressedAssemblyDescriptor {
		i32 448032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29232088; uint32_t buffer_offset
	}, ; 128: Xamarin.GooglePlayServices.Basement
	%struct.CompressedAssemblyDescriptor {
		i32 247216, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29680120; uint32_t buffer_offset
	}, ; 129: Xamarin.GooglePlayServices.Location
	%struct.CompressedAssemblyDescriptor {
		i32 82464, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29927336; uint32_t buffer_offset
	}, ; 130: Xamarin.GooglePlayServices.Tasks
	%struct.CompressedAssemblyDescriptor {
		i32 165944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30009800; uint32_t buffer_offset
	}, ; 131: Xamarin.Jetbrains.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 28728, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30175744; uint32_t buffer_offset
	}, ; 132: Xamarin.JSpecify
	%struct.CompressedAssemblyDescriptor {
		i32 2375680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30204472; uint32_t buffer_offset
	}, ; 133: Xamarin.Kotlin.StdLib
	%struct.CompressedAssemblyDescriptor {
		i32 27680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32580152; uint32_t buffer_offset
	}, ; 134: Xamarin.KotlinX.Coroutines.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32607832; uint32_t buffer_offset
	}, ; 135: Xamarin.KotlinX.Coroutines.Core
	%struct.CompressedAssemblyDescriptor {
		i32 568880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32624264; uint32_t buffer_offset
	}, ; 136: Xamarin.KotlinX.Coroutines.Core.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 16416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33193144; uint32_t buffer_offset
	}, ; 137: Xamarin.KotlinX.Serialization.Core
	%struct.CompressedAssemblyDescriptor {
		i32 312376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33209560; uint32_t buffer_offset
	}, ; 138: Xamarin.KotlinX.Serialization.Core.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33521936; uint32_t buffer_offset
	}, ; 139: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33537560; uint32_t buffer_offset
	}, ; 140: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33553192; uint32_t buffer_offset
	}, ; 141: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33568816; uint32_t buffer_offset
	}, ; 142: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33584440; uint32_t buffer_offset
	}, ; 143: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33600072; uint32_t buffer_offset
	}, ; 144: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33615704; uint32_t buffer_offset
	}, ; 145: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33631336; uint32_t buffer_offset
	}, ; 146: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33646960; uint32_t buffer_offset
	}, ; 147: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33662584; uint32_t buffer_offset
	}, ; 148: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33678216; uint32_t buffer_offset
	}, ; 149: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33693840; uint32_t buffer_offset
	}, ; 150: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33709464; uint32_t buffer_offset
	}, ; 151: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33725088; uint32_t buffer_offset
	}, ; 152: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33740712; uint32_t buffer_offset
	}, ; 153: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33756336; uint32_t buffer_offset
	}, ; 154: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33771960; uint32_t buffer_offset
	}, ; 155: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33787584; uint32_t buffer_offset
	}, ; 156: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33803208; uint32_t buffer_offset
	}, ; 157: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33818840; uint32_t buffer_offset
	}, ; 158: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33834504; uint32_t buffer_offset
	}, ; 159: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33850128; uint32_t buffer_offset
	}, ; 160: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33865760; uint32_t buffer_offset
	}, ; 161: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33881392; uint32_t buffer_offset
	}, ; 162: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33897024; uint32_t buffer_offset
	}, ; 163: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33912696; uint32_t buffer_offset
	}, ; 164: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33928328; uint32_t buffer_offset
	}, ; 165: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33943992; uint32_t buffer_offset
	}, ; 166: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33959616; uint32_t buffer_offset
	}, ; 167: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33975240; uint32_t buffer_offset
	}, ; 168: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33990864; uint32_t buffer_offset
	}, ; 169: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34006488; uint32_t buffer_offset
	}, ; 170: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34022152; uint32_t buffer_offset
	}, ; 171: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34037776; uint32_t buffer_offset
	}, ; 172: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 726016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34053408; uint32_t buffer_offset
	}, ; 173: _Microsoft.Android.Resource.Designer
	%struct.CompressedAssemblyDescriptor {
		i32 311632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34779424; uint32_t buffer_offset
	}, ; 174: Microsoft.CSharp
	%struct.CompressedAssemblyDescriptor {
		i32 428880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35091056; uint32_t buffer_offset
	}, ; 175: Microsoft.VisualBasic.Core
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35519936; uint32_t buffer_offset
	}, ; 176: Microsoft.VisualBasic
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35537168; uint32_t buffer_offset
	}, ; 177: Microsoft.Win32.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 33104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35552864; uint32_t buffer_offset
	}, ; 178: Microsoft.Win32.Registry
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35585968; uint32_t buffer_offset
	}, ; 179: System.AppContext
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35601152; uint32_t buffer_offset
	}, ; 180: System.Buffers
	%struct.CompressedAssemblyDescriptor {
		i32 88912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35616336; uint32_t buffer_offset
	}, ; 181: System.Collections.Concurrent
	%struct.CompressedAssemblyDescriptor {
		i32 251216, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35705248; uint32_t buffer_offset
	}, ; 182: System.Collections.Immutable
	%struct.CompressedAssemblyDescriptor {
		i32 47952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35956464; uint32_t buffer_offset
	}, ; 183: System.Collections.NonGeneric
	%struct.CompressedAssemblyDescriptor {
		i32 47952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36004416; uint32_t buffer_offset
	}, ; 184: System.Collections.Specialized
	%struct.CompressedAssemblyDescriptor {
		i32 112976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36052368; uint32_t buffer_offset
	}, ; 185: System.Collections
	%struct.CompressedAssemblyDescriptor {
		i32 102736, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36165344; uint32_t buffer_offset
	}, ; 186: System.ComponentModel.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36268080; uint32_t buffer_offset
	}, ; 187: System.ComponentModel.DataAnnotations
	%struct.CompressedAssemblyDescriptor {
		i32 26448, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36284800; uint32_t buffer_offset
	}, ; 188: System.ComponentModel.EventBasedAsync
	%struct.CompressedAssemblyDescriptor {
		i32 42320, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36311248; uint32_t buffer_offset
	}, ; 189: System.ComponentModel.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 316752, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36353568; uint32_t buffer_offset
	}, ; 190: System.ComponentModel.TypeConverter
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36670320; uint32_t buffer_offset
	}, ; 191: System.ComponentModel
	%struct.CompressedAssemblyDescriptor {
		i32 19280, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36686528; uint32_t buffer_offset
	}, ; 192: System.Configuration
	%struct.CompressedAssemblyDescriptor {
		i32 50512, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36705808; uint32_t buffer_offset
	}, ; 193: System.Console
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36756320; uint32_t buffer_offset
	}, ; 194: System.Core
	%struct.CompressedAssemblyDescriptor {
		i32 1018192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36779696; uint32_t buffer_offset
	}, ; 195: System.Data.Common
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37797888; uint32_t buffer_offset
	}, ; 196: System.Data.DataSetExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 25424, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37813584; uint32_t buffer_offset
	}, ; 197: System.Data
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37839008; uint32_t buffer_offset
	}, ; 198: System.Diagnostics.Contracts
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37855216; uint32_t buffer_offset
	}, ; 199: System.Diagnostics.Debug
	%struct.CompressedAssemblyDescriptor {
		i32 202576, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37870912; uint32_t buffer_offset
	}, ; 200: System.Diagnostics.DiagnosticSource
	%struct.CompressedAssemblyDescriptor {
		i32 29520, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38073488; uint32_t buffer_offset
	}, ; 201: System.Diagnostics.FileVersionInfo
	%struct.CompressedAssemblyDescriptor {
		i32 128848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38103008; uint32_t buffer_offset
	}, ; 202: System.Diagnostics.Process
	%struct.CompressedAssemblyDescriptor {
		i32 25936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38231856; uint32_t buffer_offset
	}, ; 203: System.Diagnostics.StackTrace
	%struct.CompressedAssemblyDescriptor {
		i32 31568, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38257792; uint32_t buffer_offset
	}, ; 204: System.Diagnostics.TextWriterTraceListener
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38289360; uint32_t buffer_offset
	}, ; 205: System.Diagnostics.Tools
	%struct.CompressedAssemblyDescriptor {
		i32 58704, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38304544; uint32_t buffer_offset
	}, ; 206: System.Diagnostics.TraceSource
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38363248; uint32_t buffer_offset
	}, ; 207: System.Diagnostics.Tracing
	%struct.CompressedAssemblyDescriptor {
		i32 64848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38379456; uint32_t buffer_offset
	}, ; 208: System.Drawing.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 20304, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38444304; uint32_t buffer_offset
	}, ; 209: System.Drawing
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38464608; uint32_t buffer_offset
	}, ; 210: System.Dynamic.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 97104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38480816; uint32_t buffer_offset
	}, ; 211: System.Formats.Asn1
	%struct.CompressedAssemblyDescriptor {
		i32 121680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38577920; uint32_t buffer_offset
	}, ; 212: System.Formats.Tar
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38699600; uint32_t buffer_offset
	}, ; 213: System.Globalization.Calendars
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38715296; uint32_t buffer_offset
	}, ; 214: System.Globalization.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38730480; uint32_t buffer_offset
	}, ; 215: System.Globalization
	%struct.CompressedAssemblyDescriptor {
		i32 41296, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38746176; uint32_t buffer_offset
	}, ; 216: System.IO.Compression.Brotli
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38787472; uint32_t buffer_offset
	}, ; 217: System.IO.Compression.FileSystem
	%struct.CompressedAssemblyDescriptor {
		i32 53584, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38802656; uint32_t buffer_offset
	}, ; 218: System.IO.Compression.ZipFile
	%struct.CompressedAssemblyDescriptor {
		i32 167760, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38856240; uint32_t buffer_offset
	}, ; 219: System.IO.Compression
	%struct.CompressedAssemblyDescriptor {
		i32 32080, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39024000; uint32_t buffer_offset
	}, ; 220: System.IO.FileSystem.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 51536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39056080; uint32_t buffer_offset
	}, ; 221: System.IO.FileSystem.DriveInfo
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39107616; uint32_t buffer_offset
	}, ; 222: System.IO.FileSystem.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 55120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39122800; uint32_t buffer_offset
	}, ; 223: System.IO.FileSystem.Watcher
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39177920; uint32_t buffer_offset
	}, ; 224: System.IO.FileSystem
	%struct.CompressedAssemblyDescriptor {
		i32 43344, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39193616; uint32_t buffer_offset
	}, ; 225: System.IO.IsolatedStorage
	%struct.CompressedAssemblyDescriptor {
		i32 50000, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39236960; uint32_t buffer_offset
	}, ; 226: System.IO.MemoryMappedFiles
	%struct.CompressedAssemblyDescriptor {
		i32 78160, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39286960; uint32_t buffer_offset
	}, ; 227: System.IO.Pipelines
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39365120; uint32_t buffer_offset
	}, ; 228: System.IO.Pipes.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 67408, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39388496; uint32_t buffer_offset
	}, ; 229: System.IO.Pipes
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39455904; uint32_t buffer_offset
	}, ; 230: System.IO.UnmanagedMemoryStream
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39471600; uint32_t buffer_offset
	}, ; 231: System.IO
	%struct.CompressedAssemblyDescriptor {
		i32 456528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39487296; uint32_t buffer_offset
	}, ; 232: System.Linq.AsyncEnumerable
	%struct.CompressedAssemblyDescriptor {
		i32 575312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39943824; uint32_t buffer_offset
	}, ; 233: System.Linq.Expressions
	%struct.CompressedAssemblyDescriptor {
		i32 223056, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40519136; uint32_t buffer_offset
	}, ; 234: System.Linq.Parallel
	%struct.CompressedAssemblyDescriptor {
		i32 78672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40742192; uint32_t buffer_offset
	}, ; 235: System.Linq.Queryable
	%struct.CompressedAssemblyDescriptor {
		i32 201040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40820864; uint32_t buffer_offset
	}, ; 236: System.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 55632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41021904; uint32_t buffer_offset
	}, ; 237: System.Memory
	%struct.CompressedAssemblyDescriptor {
		i32 56144, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41077536; uint32_t buffer_offset
	}, ; 238: System.Net.Http.Json
	%struct.CompressedAssemblyDescriptor {
		i32 680272, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41133680; uint32_t buffer_offset
	}, ; 239: System.Net.Http
	%struct.CompressedAssemblyDescriptor {
		i32 132432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41813952; uint32_t buffer_offset
	}, ; 240: System.Net.HttpListener
	%struct.CompressedAssemblyDescriptor {
		i32 174928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41946384; uint32_t buffer_offset
	}, ; 241: System.Net.Mail
	%struct.CompressedAssemblyDescriptor {
		i32 52560, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42121312; uint32_t buffer_offset
	}, ; 242: System.Net.NameResolution
	%struct.CompressedAssemblyDescriptor {
		i32 66384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42173872; uint32_t buffer_offset
	}, ; 243: System.Net.NetworkInformation
	%struct.CompressedAssemblyDescriptor {
		i32 55632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42240256; uint32_t buffer_offset
	}, ; 244: System.Net.Ping
	%struct.CompressedAssemblyDescriptor {
		i32 108880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42295888; uint32_t buffer_offset
	}, ; 245: System.Net.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 171856, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42404768; uint32_t buffer_offset
	}, ; 246: System.Net.Quic
	%struct.CompressedAssemblyDescriptor {
		i32 161616, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42576624; uint32_t buffer_offset
	}, ; 247: System.Net.Requests
	%struct.CompressedAssemblyDescriptor {
		i32 255312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42738240; uint32_t buffer_offset
	}, ; 248: System.Net.Security
	%struct.CompressedAssemblyDescriptor {
		i32 40784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42993552; uint32_t buffer_offset
	}, ; 249: System.Net.ServerSentEvents
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43034336; uint32_t buffer_offset
	}, ; 250: System.Net.ServicePoint
	%struct.CompressedAssemblyDescriptor {
		i32 238416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43049520; uint32_t buffer_offset
	}, ; 251: System.Net.Sockets
	%struct.CompressedAssemblyDescriptor {
		i32 70480, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43287936; uint32_t buffer_offset
	}, ; 252: System.Net.WebClient
	%struct.CompressedAssemblyDescriptor {
		i32 33104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43358416; uint32_t buffer_offset
	}, ; 253: System.Net.WebHeaderCollection
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43391520; uint32_t buffer_offset
	}, ; 254: System.Net.WebProxy
	%struct.CompressedAssemblyDescriptor {
		i32 51536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43414896; uint32_t buffer_offset
	}, ; 255: System.Net.WebSockets.Client
	%struct.CompressedAssemblyDescriptor {
		i32 108880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43466432; uint32_t buffer_offset
	}, ; 256: System.Net.WebSockets
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43575312; uint32_t buffer_offset
	}, ; 257: System.Net
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43592544; uint32_t buffer_offset
	}, ; 258: System.Numerics.Vectors
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43608240; uint32_t buffer_offset
	}, ; 259: System.Numerics
	%struct.CompressedAssemblyDescriptor {
		i32 41296, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43623424; uint32_t buffer_offset
	}, ; 260: System.ObjectModel
	%struct.CompressedAssemblyDescriptor {
		i32 859472, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43664720; uint32_t buffer_offset
	}, ; 261: System.Private.DataContractSerialization
	%struct.CompressedAssemblyDescriptor {
		i32 105808, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44524192; uint32_t buffer_offset
	}, ; 262: System.Private.Uri
	%struct.CompressedAssemblyDescriptor {
		i32 153936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44630000; uint32_t buffer_offset
	}, ; 263: System.Private.Xml.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 3106128, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44783936; uint32_t buffer_offset
	}, ; 264: System.Private.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 38224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47890064; uint32_t buffer_offset
	}, ; 265: System.Reflection.DispatchProxy
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47928288; uint32_t buffer_offset
	}, ; 266: System.Reflection.Emit.ILGeneration
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47943984; uint32_t buffer_offset
	}, ; 267: System.Reflection.Emit.Lightweight
	%struct.CompressedAssemblyDescriptor {
		i32 133456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47959680; uint32_t buffer_offset
	}, ; 268: System.Reflection.Emit
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48093136; uint32_t buffer_offset
	}, ; 269: System.Reflection.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 503632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48108320; uint32_t buffer_offset
	}, ; 270: System.Reflection.Metadata
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48611952; uint32_t buffer_offset
	}, ; 271: System.Reflection.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 24400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48627648; uint32_t buffer_offset
	}, ; 272: System.Reflection.TypeExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48652048; uint32_t buffer_offset
	}, ; 273: System.Reflection
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48668256; uint32_t buffer_offset
	}, ; 274: System.Resources.Reader
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48683440; uint32_t buffer_offset
	}, ; 275: System.Resources.ResourceManager
	%struct.CompressedAssemblyDescriptor {
		i32 26960, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48699136; uint32_t buffer_offset
	}, ; 276: System.Resources.Writer
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48726096; uint32_t buffer_offset
	}, ; 277: System.Runtime.CompilerServices.Unsafe
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48741280; uint32_t buffer_offset
	}, ; 278: System.Runtime.CompilerServices.VisualC
	%struct.CompressedAssemblyDescriptor {
		i32 17744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48758512; uint32_t buffer_offset
	}, ; 279: System.Runtime.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48776256; uint32_t buffer_offset
	}, ; 280: System.Runtime.Handles
	%struct.CompressedAssemblyDescriptor {
		i32 38224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48791952; uint32_t buffer_offset
	}, ; 281: System.Runtime.InteropServices.JavaScript
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48830176; uint32_t buffer_offset
	}, ; 282: System.Runtime.InteropServices.RuntimeInformation
	%struct.CompressedAssemblyDescriptor {
		i32 64848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48845360; uint32_t buffer_offset
	}, ; 283: System.Runtime.InteropServices
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48910208; uint32_t buffer_offset
	}, ; 284: System.Runtime.Intrinsics
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48927440; uint32_t buffer_offset
	}, ; 285: System.Runtime.Loader
	%struct.CompressedAssemblyDescriptor {
		i32 145232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48943136; uint32_t buffer_offset
	}, ; 286: System.Runtime.Numerics
	%struct.CompressedAssemblyDescriptor {
		i32 65872, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49088368; uint32_t buffer_offset
	}, ; 287: System.Runtime.Serialization.Formatters
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49154240; uint32_t buffer_offset
	}, ; 288: System.Runtime.Serialization.Json
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49169936; uint32_t buffer_offset
	}, ; 289: System.Runtime.Serialization.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49193312; uint32_t buffer_offset
	}, ; 290: System.Runtime.Serialization.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49210032; uint32_t buffer_offset
	}, ; 291: System.Runtime.Serialization
	%struct.CompressedAssemblyDescriptor {
		i32 44880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49227264; uint32_t buffer_offset
	}, ; 292: System.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 58192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49272144; uint32_t buffer_offset
	}, ; 293: System.Security.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 55120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49330336; uint32_t buffer_offset
	}, ; 294: System.Security.Claims
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49385456; uint32_t buffer_offset
	}, ; 295: System.Security.Cryptography.Algorithms
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49402688; uint32_t buffer_offset
	}, ; 296: System.Security.Cryptography.Cng
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49418896; uint32_t buffer_offset
	}, ; 297: System.Security.Cryptography.Csp
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49435104; uint32_t buffer_offset
	}, ; 298: System.Security.Cryptography.Encoding
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49450800; uint32_t buffer_offset
	}, ; 299: System.Security.Cryptography.OpenSsl
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49466496; uint32_t buffer_offset
	}, ; 300: System.Security.Cryptography.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49482192; uint32_t buffer_offset
	}, ; 301: System.Security.Cryptography.X509Certificates
	%struct.CompressedAssemblyDescriptor {
		i32 852816, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49498912; uint32_t buffer_offset
	}, ; 302: System.Security.Cryptography
	%struct.CompressedAssemblyDescriptor {
		i32 37712, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50351728; uint32_t buffer_offset
	}, ; 303: System.Security.Principal.Windows
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50389440; uint32_t buffer_offset
	}, ; 304: System.Security.Principal
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50404624; uint32_t buffer_offset
	}, ; 305: System.Security.SecureString
	%struct.CompressedAssemblyDescriptor {
		i32 18256, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50420320; uint32_t buffer_offset
	}, ; 306: System.Security
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50438576; uint32_t buffer_offset
	}, ; 307: System.ServiceModel.Web
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50455296; uint32_t buffer_offset
	}, ; 308: System.ServiceProcess
	%struct.CompressedAssemblyDescriptor {
		i32 742736, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50470992; uint32_t buffer_offset
	}, ; 309: System.Text.Encoding.CodePages
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51213728; uint32_t buffer_offset
	}, ; 310: System.Text.Encoding.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51229424; uint32_t buffer_offset
	}, ; 311: System.Text.Encoding
	%struct.CompressedAssemblyDescriptor {
		i32 65872, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51245120; uint32_t buffer_offset
	}, ; 312: System.Text.Encodings.Web
	%struct.CompressedAssemblyDescriptor {
		i32 649040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51310992; uint32_t buffer_offset
	}, ; 313: System.Text.Json
	%struct.CompressedAssemblyDescriptor {
		i32 384848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51960032; uint32_t buffer_offset
	}, ; 314: System.Text.RegularExpressions
	%struct.CompressedAssemblyDescriptor {
		i32 33616, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52344880; uint32_t buffer_offset
	}, ; 315: System.Threading.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 66384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52378496; uint32_t buffer_offset
	}, ; 316: System.Threading.Channels
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52444880; uint32_t buffer_offset
	}, ; 317: System.Threading.Overlapped
	%struct.CompressedAssemblyDescriptor {
		i32 185680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52460576; uint32_t buffer_offset
	}, ; 318: System.Threading.Tasks.Dataflow
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52646256; uint32_t buffer_offset
	}, ; 319: System.Threading.Tasks.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 61264, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52661952; uint32_t buffer_offset
	}, ; 320: System.Threading.Tasks.Parallel
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52723216; uint32_t buffer_offset
	}, ; 321: System.Threading.Tasks
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52739936; uint32_t buffer_offset
	}, ; 322: System.Threading.Thread
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52755632; uint32_t buffer_offset
	}, ; 323: System.Threading.ThreadPool
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52771328; uint32_t buffer_offset
	}, ; 324: System.Threading.Timer
	%struct.CompressedAssemblyDescriptor {
		i32 44880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52786512; uint32_t buffer_offset
	}, ; 325: System.Threading
	%struct.CompressedAssemblyDescriptor {
		i32 175952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52831392; uint32_t buffer_offset
	}, ; 326: System.Transactions.Local
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53007344; uint32_t buffer_offset
	}, ; 327: System.Transactions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53024064; uint32_t buffer_offset
	}, ; 328: System.ValueTuple
	%struct.CompressedAssemblyDescriptor {
		i32 30032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53039760; uint32_t buffer_offset
	}, ; 329: System.Web.HttpUtility
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53069792; uint32_t buffer_offset
	}, ; 330: System.Web
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53084976; uint32_t buffer_offset
	}, ; 331: System.Windows
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53100672; uint32_t buffer_offset
	}, ; 332: System.Xml.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 21840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53116368; uint32_t buffer_offset
	}, ; 333: System.Xml.ReaderWriter
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53138208; uint32_t buffer_offset
	}, ; 334: System.Xml.Serialization
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53154416; uint32_t buffer_offset
	}, ; 335: System.Xml.XDocument
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53170112; uint32_t buffer_offset
	}, ; 336: System.Xml.XPath.XDocument
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53185808; uint32_t buffer_offset
	}, ; 337: System.Xml.XPath
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53201504; uint32_t buffer_offset
	}, ; 338: System.Xml.XmlDocument
	%struct.CompressedAssemblyDescriptor {
		i32 17744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53217200; uint32_t buffer_offset
	}, ; 339: System.Xml.XmlSerializer
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53234944; uint32_t buffer_offset
	}, ; 340: System.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 50512, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53258320; uint32_t buffer_offset
	}, ; 341: System
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53308832; uint32_t buffer_offset
	}, ; 342: WindowsBase
	%struct.CompressedAssemblyDescriptor {
		i32 59728, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53325040; uint32_t buffer_offset
	}, ; 343: mscorlib
	%struct.CompressedAssemblyDescriptor {
		i32 100688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53384768; uint32_t buffer_offset
	}, ; 344: netstandard
	%struct.CompressedAssemblyDescriptor {
		i32 244768, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53485456; uint32_t buffer_offset
	}, ; 345: Java.Interop
	%struct.CompressedAssemblyDescriptor {
		i32 83528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53730224; uint32_t buffer_offset
	}, ; 346: Mono.Android.Export
	%struct.CompressedAssemblyDescriptor {
		i32 22560, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53813752; uint32_t buffer_offset
	}, ; 347: Mono.Android.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 41570376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53836312; uint32_t buffer_offset
	}, ; 348: Mono.Android
	%struct.CompressedAssemblyDescriptor {
		i32 55840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 95406688; uint32_t buffer_offset
	}, ; 349: System.IO.Hashing
	%struct.CompressedAssemblyDescriptor {
		i32 4922192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 95462528; uint32_t buffer_offset
	} ; 350: System.Private.CoreLib
], align 4

@uncompressed_assemblies_data_size = dso_local local_unnamed_addr constant i32 100384720, align 4

@uncompressed_assemblies_data_buffer = dso_local local_unnamed_addr global [100384720 x i8] zeroinitializer, align 1

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
!7 = !{i32 1, !"min_enum_size", i32 4}
