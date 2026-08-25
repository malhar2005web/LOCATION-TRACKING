; ModuleID = 'compressed_assemblies.arm64-v8a.ll'
source_filename = "compressed_assemblies.arm64-v8a.ll"
target datalayout = "e-m:e-i8:8:32-i16:16:32-i64:64-i128:128-n32:64-S128"
target triple = "aarch64-unknown-linux-android21"

%struct.CompressedAssemblyDescriptor = type {
	i32, ; uint32_t uncompressed_file_size
	i1, ; bool loaded
	i32 ; uint32_t buffer_offset
}

@compressed_assembly_count = dso_local local_unnamed_addr constant i32 351, align 4

@compressed_assembly_descriptors = dso_local local_unnamed_addr global [351 x %struct.CompressedAssemblyDescriptor] [
	%struct.CompressedAssemblyDescriptor {
		i32 370176, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 0; uint32_t buffer_offset
	}, ; 0: LOCATION_TRACKING
	%struct.CompressedAssemblyDescriptor {
		i32 174128, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 370176; uint32_t buffer_offset
	}, ; 1: GoogleGson
	%struct.CompressedAssemblyDescriptor {
		i32 56120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 544304; uint32_t buffer_offset
	}, ; 2: Microsoft.AspNetCore.Authorization
	%struct.CompressedAssemblyDescriptor {
		i32 399632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 600424; uint32_t buffer_offset
	}, ; 3: Microsoft.AspNetCore.Components
	%struct.CompressedAssemblyDescriptor {
		i32 48392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1000056; uint32_t buffer_offset
	}, ; 4: Microsoft.AspNetCore.Components.Forms
	%struct.CompressedAssemblyDescriptor {
		i32 189744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1048448; uint32_t buffer_offset
	}, ; 5: Microsoft.AspNetCore.Components.Web
	%struct.CompressedAssemblyDescriptor {
		i32 114448, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1238192; uint32_t buffer_offset
	}, ; 6: Microsoft.AspNetCore.Components.WebView
	%struct.CompressedAssemblyDescriptor {
		i32 70456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1352640; uint32_t buffer_offset
	}, ; 7: Microsoft.AspNetCore.Components.WebView.Maui
	%struct.CompressedAssemblyDescriptor {
		i32 16696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1423096; uint32_t buffer_offset
	}, ; 8: Microsoft.AspNetCore.Metadata
	%struct.CompressedAssemblyDescriptor {
		i32 45320, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1439792; uint32_t buffer_offset
	}, ; 9: Microsoft.Extensions.Configuration
	%struct.CompressedAssemblyDescriptor {
		i32 28984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1485112; uint32_t buffer_offset
	}, ; 10: Microsoft.Extensions.Configuration.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 43792, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1514096; uint32_t buffer_offset
	}, ; 11: Microsoft.Extensions.Configuration.Binder
	%struct.CompressedAssemblyDescriptor {
		i32 28976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1557888; uint32_t buffer_offset
	}, ; 12: Microsoft.Extensions.Configuration.FileExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 28472, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1586864; uint32_t buffer_offset
	}, ; 13: Microsoft.Extensions.Configuration.Json
	%struct.CompressedAssemblyDescriptor {
		i32 96008, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1615336; uint32_t buffer_offset
	}, ; 14: Microsoft.Extensions.DependencyInjection
	%struct.CompressedAssemblyDescriptor {
		i32 66312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1711344; uint32_t buffer_offset
	}, ; 15: Microsoft.Extensions.DependencyInjection.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 36624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1777656; uint32_t buffer_offset
	}, ; 16: Microsoft.Extensions.Diagnostics
	%struct.CompressedAssemblyDescriptor {
		i32 31504, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1814280; uint32_t buffer_offset
	}, ; 17: Microsoft.Extensions.Diagnostics.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 23864, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1845784; uint32_t buffer_offset
	}, ; 18: Microsoft.Extensions.FileProviders.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 19208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1869648; uint32_t buffer_offset
	}, ; 19: Microsoft.Extensions.FileProviders.Composite
	%struct.CompressedAssemblyDescriptor {
		i32 34104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1888856; uint32_t buffer_offset
	}, ; 20: Microsoft.Extensions.FileProviders.Embedded
	%struct.CompressedAssemblyDescriptor {
		i32 45840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1922960; uint32_t buffer_offset
	}, ; 21: Microsoft.Extensions.FileProviders.Physical
	%struct.CompressedAssemblyDescriptor {
		i32 48400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1968800; uint32_t buffer_offset
	}, ; 22: Microsoft.Extensions.FileSystemGlobbing
	%struct.CompressedAssemblyDescriptor {
		i32 54536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2017200; uint32_t buffer_offset
	}, ; 23: Microsoft.Extensions.Hosting.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 52016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2071736; uint32_t buffer_offset
	}, ; 24: Microsoft.Extensions.Logging
	%struct.CompressedAssemblyDescriptor {
		i32 67344, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2123752; uint32_t buffer_offset
	}, ; 25: Microsoft.Extensions.Logging.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 20240, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2191096; uint32_t buffer_offset
	}, ; 26: Microsoft.Extensions.Logging.Debug
	%struct.CompressedAssemblyDescriptor {
		i32 65848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2211336; uint32_t buffer_offset
	}, ; 27: Microsoft.Extensions.Options
	%struct.CompressedAssemblyDescriptor {
		i32 22280, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2277184; uint32_t buffer_offset
	}, ; 28: Microsoft.Extensions.Options.ConfigurationExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 45328, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2299464; uint32_t buffer_offset
	}, ; 29: Microsoft.Extensions.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 43784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2344792; uint32_t buffer_offset
	}, ; 30: Microsoft.Extensions.Validation
	%struct.CompressedAssemblyDescriptor {
		i32 75528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2388576; uint32_t buffer_offset
	}, ; 31: Microsoft.JSInterop
	%struct.CompressedAssemblyDescriptor {
		i32 1928504, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2464104; uint32_t buffer_offset
	}, ; 32: Microsoft.Maui.Controls
	%struct.CompressedAssemblyDescriptor {
		i32 135432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 4392608; uint32_t buffer_offset
	}, ; 33: Microsoft.Maui.Controls.Xaml
	%struct.CompressedAssemblyDescriptor {
		i32 875832, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 4528040; uint32_t buffer_offset
	}, ; 34: Microsoft.Maui
	%struct.CompressedAssemblyDescriptor {
		i32 280848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5403872; uint32_t buffer_offset
	}, ; 35: Microsoft.Maui.Essentials
	%struct.CompressedAssemblyDescriptor {
		i32 208696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5684720; uint32_t buffer_offset
	}, ; 36: Microsoft.Maui.Graphics
	%struct.CompressedAssemblyDescriptor {
		i32 74240, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5893416; uint32_t buffer_offset
	}, ; 37: Plugin.LocalNotification
	%struct.CompressedAssemblyDescriptor {
		i32 107520, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5967656; uint32_t buffer_offset
	}, ; 38: SQLite-net
	%struct.CompressedAssemblyDescriptor {
		i32 5632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6075176; uint32_t buffer_offset
	}, ; 39: SQLitePCLRaw.batteries_v2
	%struct.CompressedAssemblyDescriptor {
		i32 50688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6080808; uint32_t buffer_offset
	}, ; 40: SQLitePCLRaw.core
	%struct.CompressedAssemblyDescriptor {
		i32 5632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6131496; uint32_t buffer_offset
	}, ; 41: SQLitePCLRaw.lib.e_sqlite3.android
	%struct.CompressedAssemblyDescriptor {
		i32 35840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6137128; uint32_t buffer_offset
	}, ; 42: SQLitePCLRaw.provider.e_sqlite3
	%struct.CompressedAssemblyDescriptor {
		i32 1194040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6172968; uint32_t buffer_offset
	}, ; 43: Xamarin.Android.Glide
	%struct.CompressedAssemblyDescriptor {
		i32 15944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7367008; uint32_t buffer_offset
	}, ; 44: Xamarin.Android.Glide.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 25632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7382952; uint32_t buffer_offset
	}, ; 45: Xamarin.Android.Glide.DiskLruCache
	%struct.CompressedAssemblyDescriptor {
		i32 63032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7408584; uint32_t buffer_offset
	}, ; 46: Xamarin.Android.Glide.GifDecoder
	%struct.CompressedAssemblyDescriptor {
		i32 197688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7471616; uint32_t buffer_offset
	}, ; 47: Xamarin.AndroidX.Activity
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7669304; uint32_t buffer_offset
	}, ; 48: Xamarin.AndroidX.Activity.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 15912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7685232; uint32_t buffer_offset
	}, ; 49: Xamarin.AndroidX.Annotation
	%struct.CompressedAssemblyDescriptor {
		i32 38432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7701144; uint32_t buffer_offset
	}, ; 50: Xamarin.AndroidX.Annotation.Experimental
	%struct.CompressedAssemblyDescriptor {
		i32 215608, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7739576; uint32_t buffer_offset
	}, ; 51: Xamarin.AndroidX.Annotation.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 1305632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7955184; uint32_t buffer_offset
	}, ; 52: Xamarin.AndroidX.AppCompat
	%struct.CompressedAssemblyDescriptor {
		i32 103456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9260816; uint32_t buffer_offset
	}, ; 53: Xamarin.AndroidX.AppCompat.AppCompatResources
	%struct.CompressedAssemblyDescriptor {
		i32 38984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9364272; uint32_t buffer_offset
	}, ; 54: Xamarin.AndroidX.Arch.Core.Common
	%struct.CompressedAssemblyDescriptor {
		i32 28192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9403256; uint32_t buffer_offset
	}, ; 55: Xamarin.AndroidX.Arch.Core.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 411184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9431448; uint32_t buffer_offset
	}, ; 56: Xamarin.AndroidX.Browser
	%struct.CompressedAssemblyDescriptor {
		i32 35400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9842632; uint32_t buffer_offset
	}, ; 57: Xamarin.AndroidX.CardView
	%struct.CompressedAssemblyDescriptor {
		i32 15944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9878032; uint32_t buffer_offset
	}, ; 58: Xamarin.AndroidX.Collection
	%struct.CompressedAssemblyDescriptor {
		i32 628768, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9893976; uint32_t buffer_offset
	}, ; 59: Xamarin.AndroidX.Collection.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10522744; uint32_t buffer_offset
	}, ; 60: Xamarin.AndroidX.Collection.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 36424, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10538648; uint32_t buffer_offset
	}, ; 61: Xamarin.AndroidX.Concurrent.Futures
	%struct.CompressedAssemblyDescriptor {
		i32 752680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10575072; uint32_t buffer_offset
	}, ; 62: Xamarin.AndroidX.ConstraintLayout
	%struct.CompressedAssemblyDescriptor {
		i32 1466936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 11327752; uint32_t buffer_offset
	}, ; 63: Xamarin.AndroidX.ConstraintLayout.Core
	%struct.CompressedAssemblyDescriptor {
		i32 112680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 12794688; uint32_t buffer_offset
	}, ; 64: Xamarin.AndroidX.CoordinatorLayout
	%struct.CompressedAssemblyDescriptor {
		i32 2221568, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 12907368; uint32_t buffer_offset
	}, ; 65: Xamarin.AndroidX.Core
	%struct.CompressedAssemblyDescriptor {
		i32 216608, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15128936; uint32_t buffer_offset
	}, ; 66: Xamarin.AndroidX.Core.Core.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 20016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15345544; uint32_t buffer_offset
	}, ; 67: Xamarin.AndroidX.Core.ViewTree
	%struct.CompressedAssemblyDescriptor {
		i32 64040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15365560; uint32_t buffer_offset
	}, ; 68: Xamarin.AndroidX.CursorAdapter
	%struct.CompressedAssemblyDescriptor {
		i32 74776, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15429600; uint32_t buffer_offset
	}, ; 69: Xamarin.AndroidX.CustomView
	%struct.CompressedAssemblyDescriptor {
		i32 25672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15504376; uint32_t buffer_offset
	}, ; 70: Xamarin.AndroidX.CustomView.PoolingContainer
	%struct.CompressedAssemblyDescriptor {
		i32 67632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15530048; uint32_t buffer_offset
	}, ; 71: Xamarin.AndroidX.DrawerLayout
	%struct.CompressedAssemblyDescriptor {
		i32 73272, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15597680; uint32_t buffer_offset
	}, ; 72: Xamarin.AndroidX.DynamicAnimation
	%struct.CompressedAssemblyDescriptor {
		i32 288816, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15670952; uint32_t buffer_offset
	}, ; 73: Xamarin.AndroidX.Emoji2
	%struct.CompressedAssemblyDescriptor {
		i32 26144, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15959768; uint32_t buffer_offset
	}, ; 74: Xamarin.AndroidX.Emoji2.ViewsHelper
	%struct.CompressedAssemblyDescriptor {
		i32 73288, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15985912; uint32_t buffer_offset
	}, ; 75: Xamarin.AndroidX.ExifInterface
	%struct.CompressedAssemblyDescriptor {
		i32 384544, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16059200; uint32_t buffer_offset
	}, ; 76: Xamarin.AndroidX.Fragment
	%struct.CompressedAssemblyDescriptor {
		i32 27192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16443744; uint32_t buffer_offset
	}, ; 77: Xamarin.AndroidX.Fragment.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 26152, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16470936; uint32_t buffer_offset
	}, ; 78: Xamarin.AndroidX.Interpolator
	%struct.CompressedAssemblyDescriptor {
		i32 16952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16497088; uint32_t buffer_offset
	}, ; 79: Xamarin.AndroidX.Lifecycle.Common
	%struct.CompressedAssemblyDescriptor {
		i32 71200, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16514040; uint32_t buffer_offset
	}, ; 80: Xamarin.AndroidX.Lifecycle.Common.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 39464, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16585240; uint32_t buffer_offset
	}, ; 81: Xamarin.AndroidX.Lifecycle.LiveData
	%struct.CompressedAssemblyDescriptor {
		i32 36936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16624704; uint32_t buffer_offset
	}, ; 82: Xamarin.AndroidX.Lifecycle.LiveData.Core
	%struct.CompressedAssemblyDescriptor {
		i32 16440, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16661640; uint32_t buffer_offset
	}, ; 83: Xamarin.AndroidX.Lifecycle.LiveData.Core.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 22584, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16678080; uint32_t buffer_offset
	}, ; 84: Xamarin.AndroidX.Lifecycle.Process
	%struct.CompressedAssemblyDescriptor {
		i32 15416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16700664; uint32_t buffer_offset
	}, ; 85: Xamarin.AndroidX.Lifecycle.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 54312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16716080; uint32_t buffer_offset
	}, ; 86: Xamarin.AndroidX.Lifecycle.Runtime.Android
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16770392; uint32_t buffer_offset
	}, ; 87: Xamarin.AndroidX.Lifecycle.Runtime.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 16456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16786296; uint32_t buffer_offset
	}, ; 88: Xamarin.AndroidX.Lifecycle.Runtime.Ktx.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16802752; uint32_t buffer_offset
	}, ; 89: Xamarin.AndroidX.Lifecycle.ViewModel
	%struct.CompressedAssemblyDescriptor {
		i32 88632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16819680; uint32_t buffer_offset
	}, ; 90: Xamarin.AndroidX.Lifecycle.ViewModel.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16440, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16908312; uint32_t buffer_offset
	}, ; 91: Xamarin.AndroidX.Lifecycle.ViewModel.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16924752; uint32_t buffer_offset
	}, ; 92: Xamarin.AndroidX.Lifecycle.ViewModelSavedState
	%struct.CompressedAssemblyDescriptor {
		i32 48200, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16940680; uint32_t buffer_offset
	}, ; 93: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.Android
	%struct.CompressedAssemblyDescriptor {
		i32 71720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16988880; uint32_t buffer_offset
	}, ; 94: Xamarin.AndroidX.Loader
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17060600; uint32_t buffer_offset
	}, ; 95: Xamarin.AndroidX.Navigation.Common
	%struct.CompressedAssemblyDescriptor {
		i32 233016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17076504; uint32_t buffer_offset
	}, ; 96: Xamarin.AndroidX.Navigation.Common.Android
	%struct.CompressedAssemblyDescriptor {
		i32 60960, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17309520; uint32_t buffer_offset
	}, ; 97: Xamarin.AndroidX.Navigation.Fragment
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17370480; uint32_t buffer_offset
	}, ; 98: Xamarin.AndroidX.Navigation.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 124984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17386408; uint32_t buffer_offset
	}, ; 99: Xamarin.AndroidX.Navigation.Runtime.Android
	%struct.CompressedAssemblyDescriptor {
		i32 57400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17511392; uint32_t buffer_offset
	}, ; 100: Xamarin.AndroidX.Navigation.UI
	%struct.CompressedAssemblyDescriptor {
		i32 52784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17568792; uint32_t buffer_offset
	}, ; 101: Xamarin.AndroidX.ProfileInstaller.ProfileInstaller
	%struct.CompressedAssemblyDescriptor {
		i32 668712, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17621576; uint32_t buffer_offset
	}, ; 102: Xamarin.AndroidX.RecyclerView
	%struct.CompressedAssemblyDescriptor {
		i32 30792, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18290288; uint32_t buffer_offset
	}, ; 103: Xamarin.AndroidX.ResourceInspection.Annotation
	%struct.CompressedAssemblyDescriptor {
		i32 15912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18321080; uint32_t buffer_offset
	}, ; 104: Xamarin.AndroidX.SavedState
	%struct.CompressedAssemblyDescriptor {
		i32 91688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18336992; uint32_t buffer_offset
	}, ; 105: Xamarin.AndroidX.SavedState.SavedState.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18428680; uint32_t buffer_offset
	}, ; 106: Xamarin.AndroidX.SavedState.SavedState.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 46648, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18445096; uint32_t buffer_offset
	}, ; 107: Xamarin.AndroidX.Security.SecurityCrypto
	%struct.CompressedAssemblyDescriptor {
		i32 50208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18491744; uint32_t buffer_offset
	}, ; 108: Xamarin.AndroidX.SlidingPaneLayout
	%struct.CompressedAssemblyDescriptor {
		i32 31304, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18541952; uint32_t buffer_offset
	}, ; 109: Xamarin.AndroidX.Startup.StartupRuntime
	%struct.CompressedAssemblyDescriptor {
		i32 77856, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18573256; uint32_t buffer_offset
	}, ; 110: Xamarin.AndroidX.SwipeRefreshLayout
	%struct.CompressedAssemblyDescriptor {
		i32 15392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18651112; uint32_t buffer_offset
	}, ; 111: Xamarin.AndroidX.Tracing.Tracing
	%struct.CompressedAssemblyDescriptor {
		i32 24104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18666504; uint32_t buffer_offset
	}, ; 112: Xamarin.AndroidX.Tracing.Tracing.Android
	%struct.CompressedAssemblyDescriptor {
		i32 185392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18690608; uint32_t buffer_offset
	}, ; 113: Xamarin.AndroidX.Transition
	%struct.CompressedAssemblyDescriptor {
		i32 36384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18876000; uint32_t buffer_offset
	}, ; 114: Xamarin.AndroidX.VectorDrawable
	%struct.CompressedAssemblyDescriptor {
		i32 49184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18912384; uint32_t buffer_offset
	}, ; 115: Xamarin.AndroidX.VectorDrawable.Animated
	%struct.CompressedAssemblyDescriptor {
		i32 122936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18961568; uint32_t buffer_offset
	}, ; 116: Xamarin.AndroidX.VersionedParcelable
	%struct.CompressedAssemblyDescriptor {
		i32 96288, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19084504; uint32_t buffer_offset
	}, ; 117: Xamarin.AndroidX.ViewPager
	%struct.CompressedAssemblyDescriptor {
		i32 74784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19180792; uint32_t buffer_offset
	}, ; 118: Xamarin.AndroidX.ViewPager2
	%struct.CompressedAssemblyDescriptor {
		i32 271904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19255576; uint32_t buffer_offset
	}, ; 119: Xamarin.AndroidX.Window
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19527480; uint32_t buffer_offset
	}, ; 120: Xamarin.AndroidX.Window.WindowCore
	%struct.CompressedAssemblyDescriptor {
		i32 35360, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19543384; uint32_t buffer_offset
	}, ; 121: Xamarin.AndroidX.Window.WindowCore.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 2789920, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19578744; uint32_t buffer_offset
	}, ; 122: Xamarin.Google.Android.Material
	%struct.CompressedAssemblyDescriptor {
		i32 102432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 22368664; uint32_t buffer_offset
	}, ; 123: Jsr305Binding
	%struct.CompressedAssemblyDescriptor {
		i32 5886976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 22471096; uint32_t buffer_offset
	}, ; 124: Xamarin.Google.Crypto.Tink.Android
	%struct.CompressedAssemblyDescriptor {
		i32 101944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28358072; uint32_t buffer_offset
	}, ; 125: Xamarin.Google.ErrorProne.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 27192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28460016; uint32_t buffer_offset
	}, ; 126: Xamarin.Google.Guava.ListenableFuture
	%struct.CompressedAssemblyDescriptor {
		i32 738224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28487208; uint32_t buffer_offset
	}, ; 127: Xamarin.GooglePlayServices.Base
	%struct.CompressedAssemblyDescriptor {
		i32 448032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29225432; uint32_t buffer_offset
	}, ; 128: Xamarin.GooglePlayServices.Basement
	%struct.CompressedAssemblyDescriptor {
		i32 247216, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29673464; uint32_t buffer_offset
	}, ; 129: Xamarin.GooglePlayServices.Location
	%struct.CompressedAssemblyDescriptor {
		i32 82464, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29920680; uint32_t buffer_offset
	}, ; 130: Xamarin.GooglePlayServices.Tasks
	%struct.CompressedAssemblyDescriptor {
		i32 165944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30003144; uint32_t buffer_offset
	}, ; 131: Xamarin.Jetbrains.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 28728, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30169088; uint32_t buffer_offset
	}, ; 132: Xamarin.JSpecify
	%struct.CompressedAssemblyDescriptor {
		i32 2375680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30197816; uint32_t buffer_offset
	}, ; 133: Xamarin.Kotlin.StdLib
	%struct.CompressedAssemblyDescriptor {
		i32 27680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32573496; uint32_t buffer_offset
	}, ; 134: Xamarin.KotlinX.Coroutines.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32601176; uint32_t buffer_offset
	}, ; 135: Xamarin.KotlinX.Coroutines.Core
	%struct.CompressedAssemblyDescriptor {
		i32 568880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32617608; uint32_t buffer_offset
	}, ; 136: Xamarin.KotlinX.Coroutines.Core.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 16416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33186488; uint32_t buffer_offset
	}, ; 137: Xamarin.KotlinX.Serialization.Core
	%struct.CompressedAssemblyDescriptor {
		i32 312376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33202904; uint32_t buffer_offset
	}, ; 138: Xamarin.KotlinX.Serialization.Core.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33515280; uint32_t buffer_offset
	}, ; 139: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33530904; uint32_t buffer_offset
	}, ; 140: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33546536; uint32_t buffer_offset
	}, ; 141: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33562160; uint32_t buffer_offset
	}, ; 142: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33577784; uint32_t buffer_offset
	}, ; 143: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33593416; uint32_t buffer_offset
	}, ; 144: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33609048; uint32_t buffer_offset
	}, ; 145: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33624680; uint32_t buffer_offset
	}, ; 146: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33640304; uint32_t buffer_offset
	}, ; 147: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33655928; uint32_t buffer_offset
	}, ; 148: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33671560; uint32_t buffer_offset
	}, ; 149: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33687184; uint32_t buffer_offset
	}, ; 150: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33702808; uint32_t buffer_offset
	}, ; 151: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33718432; uint32_t buffer_offset
	}, ; 152: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33734056; uint32_t buffer_offset
	}, ; 153: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33749680; uint32_t buffer_offset
	}, ; 154: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33765304; uint32_t buffer_offset
	}, ; 155: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33780928; uint32_t buffer_offset
	}, ; 156: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33796552; uint32_t buffer_offset
	}, ; 157: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33812184; uint32_t buffer_offset
	}, ; 158: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33827848; uint32_t buffer_offset
	}, ; 159: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33843472; uint32_t buffer_offset
	}, ; 160: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33859104; uint32_t buffer_offset
	}, ; 161: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33874736; uint32_t buffer_offset
	}, ; 162: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33890368; uint32_t buffer_offset
	}, ; 163: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33906040; uint32_t buffer_offset
	}, ; 164: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33921672; uint32_t buffer_offset
	}, ; 165: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33937336; uint32_t buffer_offset
	}, ; 166: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33952960; uint32_t buffer_offset
	}, ; 167: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33968584; uint32_t buffer_offset
	}, ; 168: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33984208; uint32_t buffer_offset
	}, ; 169: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33999832; uint32_t buffer_offset
	}, ; 170: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34015496; uint32_t buffer_offset
	}, ; 171: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34031120; uint32_t buffer_offset
	}, ; 172: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 726016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34046752; uint32_t buffer_offset
	}, ; 173: _Microsoft.Android.Resource.Designer
	%struct.CompressedAssemblyDescriptor {
		i32 311632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34772768; uint32_t buffer_offset
	}, ; 174: Microsoft.CSharp
	%struct.CompressedAssemblyDescriptor {
		i32 428880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35084400; uint32_t buffer_offset
	}, ; 175: Microsoft.VisualBasic.Core
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35513280; uint32_t buffer_offset
	}, ; 176: Microsoft.VisualBasic
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35530512; uint32_t buffer_offset
	}, ; 177: Microsoft.Win32.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 33104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35546208; uint32_t buffer_offset
	}, ; 178: Microsoft.Win32.Registry
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35579312; uint32_t buffer_offset
	}, ; 179: System.AppContext
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35594496; uint32_t buffer_offset
	}, ; 180: System.Buffers
	%struct.CompressedAssemblyDescriptor {
		i32 88912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35609680; uint32_t buffer_offset
	}, ; 181: System.Collections.Concurrent
	%struct.CompressedAssemblyDescriptor {
		i32 251216, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35698592; uint32_t buffer_offset
	}, ; 182: System.Collections.Immutable
	%struct.CompressedAssemblyDescriptor {
		i32 47952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35949808; uint32_t buffer_offset
	}, ; 183: System.Collections.NonGeneric
	%struct.CompressedAssemblyDescriptor {
		i32 47952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35997760; uint32_t buffer_offset
	}, ; 184: System.Collections.Specialized
	%struct.CompressedAssemblyDescriptor {
		i32 112976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36045712; uint32_t buffer_offset
	}, ; 185: System.Collections
	%struct.CompressedAssemblyDescriptor {
		i32 102736, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36158688; uint32_t buffer_offset
	}, ; 186: System.ComponentModel.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36261424; uint32_t buffer_offset
	}, ; 187: System.ComponentModel.DataAnnotations
	%struct.CompressedAssemblyDescriptor {
		i32 26448, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36278144; uint32_t buffer_offset
	}, ; 188: System.ComponentModel.EventBasedAsync
	%struct.CompressedAssemblyDescriptor {
		i32 42320, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36304592; uint32_t buffer_offset
	}, ; 189: System.ComponentModel.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 316752, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36346912; uint32_t buffer_offset
	}, ; 190: System.ComponentModel.TypeConverter
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36663664; uint32_t buffer_offset
	}, ; 191: System.ComponentModel
	%struct.CompressedAssemblyDescriptor {
		i32 19280, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36679872; uint32_t buffer_offset
	}, ; 192: System.Configuration
	%struct.CompressedAssemblyDescriptor {
		i32 50512, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36699152; uint32_t buffer_offset
	}, ; 193: System.Console
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36749664; uint32_t buffer_offset
	}, ; 194: System.Core
	%struct.CompressedAssemblyDescriptor {
		i32 1018192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36773040; uint32_t buffer_offset
	}, ; 195: System.Data.Common
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37791232; uint32_t buffer_offset
	}, ; 196: System.Data.DataSetExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 25424, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37806928; uint32_t buffer_offset
	}, ; 197: System.Data
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37832352; uint32_t buffer_offset
	}, ; 198: System.Diagnostics.Contracts
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37848560; uint32_t buffer_offset
	}, ; 199: System.Diagnostics.Debug
	%struct.CompressedAssemblyDescriptor {
		i32 202576, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37864256; uint32_t buffer_offset
	}, ; 200: System.Diagnostics.DiagnosticSource
	%struct.CompressedAssemblyDescriptor {
		i32 29520, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38066832; uint32_t buffer_offset
	}, ; 201: System.Diagnostics.FileVersionInfo
	%struct.CompressedAssemblyDescriptor {
		i32 128848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38096352; uint32_t buffer_offset
	}, ; 202: System.Diagnostics.Process
	%struct.CompressedAssemblyDescriptor {
		i32 25936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38225200; uint32_t buffer_offset
	}, ; 203: System.Diagnostics.StackTrace
	%struct.CompressedAssemblyDescriptor {
		i32 31568, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38251136; uint32_t buffer_offset
	}, ; 204: System.Diagnostics.TextWriterTraceListener
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38282704; uint32_t buffer_offset
	}, ; 205: System.Diagnostics.Tools
	%struct.CompressedAssemblyDescriptor {
		i32 58704, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38297888; uint32_t buffer_offset
	}, ; 206: System.Diagnostics.TraceSource
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38356592; uint32_t buffer_offset
	}, ; 207: System.Diagnostics.Tracing
	%struct.CompressedAssemblyDescriptor {
		i32 64848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38372800; uint32_t buffer_offset
	}, ; 208: System.Drawing.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 20304, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38437648; uint32_t buffer_offset
	}, ; 209: System.Drawing
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38457952; uint32_t buffer_offset
	}, ; 210: System.Dynamic.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 97104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38474160; uint32_t buffer_offset
	}, ; 211: System.Formats.Asn1
	%struct.CompressedAssemblyDescriptor {
		i32 121680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38571264; uint32_t buffer_offset
	}, ; 212: System.Formats.Tar
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38692944; uint32_t buffer_offset
	}, ; 213: System.Globalization.Calendars
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38708640; uint32_t buffer_offset
	}, ; 214: System.Globalization.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38723824; uint32_t buffer_offset
	}, ; 215: System.Globalization
	%struct.CompressedAssemblyDescriptor {
		i32 41296, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38739520; uint32_t buffer_offset
	}, ; 216: System.IO.Compression.Brotli
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38780816; uint32_t buffer_offset
	}, ; 217: System.IO.Compression.FileSystem
	%struct.CompressedAssemblyDescriptor {
		i32 53584, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38796000; uint32_t buffer_offset
	}, ; 218: System.IO.Compression.ZipFile
	%struct.CompressedAssemblyDescriptor {
		i32 167760, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38849584; uint32_t buffer_offset
	}, ; 219: System.IO.Compression
	%struct.CompressedAssemblyDescriptor {
		i32 32080, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39017344; uint32_t buffer_offset
	}, ; 220: System.IO.FileSystem.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 51536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39049424; uint32_t buffer_offset
	}, ; 221: System.IO.FileSystem.DriveInfo
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39100960; uint32_t buffer_offset
	}, ; 222: System.IO.FileSystem.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 55120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39116144; uint32_t buffer_offset
	}, ; 223: System.IO.FileSystem.Watcher
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39171264; uint32_t buffer_offset
	}, ; 224: System.IO.FileSystem
	%struct.CompressedAssemblyDescriptor {
		i32 43344, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39186960; uint32_t buffer_offset
	}, ; 225: System.IO.IsolatedStorage
	%struct.CompressedAssemblyDescriptor {
		i32 50000, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39230304; uint32_t buffer_offset
	}, ; 226: System.IO.MemoryMappedFiles
	%struct.CompressedAssemblyDescriptor {
		i32 78160, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39280304; uint32_t buffer_offset
	}, ; 227: System.IO.Pipelines
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39358464; uint32_t buffer_offset
	}, ; 228: System.IO.Pipes.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 67408, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39381840; uint32_t buffer_offset
	}, ; 229: System.IO.Pipes
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39449248; uint32_t buffer_offset
	}, ; 230: System.IO.UnmanagedMemoryStream
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39464944; uint32_t buffer_offset
	}, ; 231: System.IO
	%struct.CompressedAssemblyDescriptor {
		i32 456528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39480640; uint32_t buffer_offset
	}, ; 232: System.Linq.AsyncEnumerable
	%struct.CompressedAssemblyDescriptor {
		i32 575312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39937168; uint32_t buffer_offset
	}, ; 233: System.Linq.Expressions
	%struct.CompressedAssemblyDescriptor {
		i32 223056, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40512480; uint32_t buffer_offset
	}, ; 234: System.Linq.Parallel
	%struct.CompressedAssemblyDescriptor {
		i32 78672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40735536; uint32_t buffer_offset
	}, ; 235: System.Linq.Queryable
	%struct.CompressedAssemblyDescriptor {
		i32 201040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40814208; uint32_t buffer_offset
	}, ; 236: System.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 55632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41015248; uint32_t buffer_offset
	}, ; 237: System.Memory
	%struct.CompressedAssemblyDescriptor {
		i32 56144, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41070880; uint32_t buffer_offset
	}, ; 238: System.Net.Http.Json
	%struct.CompressedAssemblyDescriptor {
		i32 680272, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41127024; uint32_t buffer_offset
	}, ; 239: System.Net.Http
	%struct.CompressedAssemblyDescriptor {
		i32 132432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41807296; uint32_t buffer_offset
	}, ; 240: System.Net.HttpListener
	%struct.CompressedAssemblyDescriptor {
		i32 174928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41939728; uint32_t buffer_offset
	}, ; 241: System.Net.Mail
	%struct.CompressedAssemblyDescriptor {
		i32 52560, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42114656; uint32_t buffer_offset
	}, ; 242: System.Net.NameResolution
	%struct.CompressedAssemblyDescriptor {
		i32 66384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42167216; uint32_t buffer_offset
	}, ; 243: System.Net.NetworkInformation
	%struct.CompressedAssemblyDescriptor {
		i32 55632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42233600; uint32_t buffer_offset
	}, ; 244: System.Net.Ping
	%struct.CompressedAssemblyDescriptor {
		i32 108880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42289232; uint32_t buffer_offset
	}, ; 245: System.Net.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 171856, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42398112; uint32_t buffer_offset
	}, ; 246: System.Net.Quic
	%struct.CompressedAssemblyDescriptor {
		i32 161616, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42569968; uint32_t buffer_offset
	}, ; 247: System.Net.Requests
	%struct.CompressedAssemblyDescriptor {
		i32 255312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42731584; uint32_t buffer_offset
	}, ; 248: System.Net.Security
	%struct.CompressedAssemblyDescriptor {
		i32 40784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42986896; uint32_t buffer_offset
	}, ; 249: System.Net.ServerSentEvents
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43027680; uint32_t buffer_offset
	}, ; 250: System.Net.ServicePoint
	%struct.CompressedAssemblyDescriptor {
		i32 238416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43042864; uint32_t buffer_offset
	}, ; 251: System.Net.Sockets
	%struct.CompressedAssemblyDescriptor {
		i32 70480, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43281280; uint32_t buffer_offset
	}, ; 252: System.Net.WebClient
	%struct.CompressedAssemblyDescriptor {
		i32 33104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43351760; uint32_t buffer_offset
	}, ; 253: System.Net.WebHeaderCollection
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43384864; uint32_t buffer_offset
	}, ; 254: System.Net.WebProxy
	%struct.CompressedAssemblyDescriptor {
		i32 51536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43408240; uint32_t buffer_offset
	}, ; 255: System.Net.WebSockets.Client
	%struct.CompressedAssemblyDescriptor {
		i32 108880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43459776; uint32_t buffer_offset
	}, ; 256: System.Net.WebSockets
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43568656; uint32_t buffer_offset
	}, ; 257: System.Net
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43585888; uint32_t buffer_offset
	}, ; 258: System.Numerics.Vectors
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43601584; uint32_t buffer_offset
	}, ; 259: System.Numerics
	%struct.CompressedAssemblyDescriptor {
		i32 41296, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43616768; uint32_t buffer_offset
	}, ; 260: System.ObjectModel
	%struct.CompressedAssemblyDescriptor {
		i32 859472, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43658064; uint32_t buffer_offset
	}, ; 261: System.Private.DataContractSerialization
	%struct.CompressedAssemblyDescriptor {
		i32 105808, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44517536; uint32_t buffer_offset
	}, ; 262: System.Private.Uri
	%struct.CompressedAssemblyDescriptor {
		i32 153936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44623344; uint32_t buffer_offset
	}, ; 263: System.Private.Xml.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 3106128, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44777280; uint32_t buffer_offset
	}, ; 264: System.Private.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 38224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47883408; uint32_t buffer_offset
	}, ; 265: System.Reflection.DispatchProxy
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47921632; uint32_t buffer_offset
	}, ; 266: System.Reflection.Emit.ILGeneration
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47937328; uint32_t buffer_offset
	}, ; 267: System.Reflection.Emit.Lightweight
	%struct.CompressedAssemblyDescriptor {
		i32 133456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47953024; uint32_t buffer_offset
	}, ; 268: System.Reflection.Emit
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48086480; uint32_t buffer_offset
	}, ; 269: System.Reflection.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 503632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48101664; uint32_t buffer_offset
	}, ; 270: System.Reflection.Metadata
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48605296; uint32_t buffer_offset
	}, ; 271: System.Reflection.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 24400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48620992; uint32_t buffer_offset
	}, ; 272: System.Reflection.TypeExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48645392; uint32_t buffer_offset
	}, ; 273: System.Reflection
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48661600; uint32_t buffer_offset
	}, ; 274: System.Resources.Reader
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48676784; uint32_t buffer_offset
	}, ; 275: System.Resources.ResourceManager
	%struct.CompressedAssemblyDescriptor {
		i32 26960, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48692480; uint32_t buffer_offset
	}, ; 276: System.Resources.Writer
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48719440; uint32_t buffer_offset
	}, ; 277: System.Runtime.CompilerServices.Unsafe
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48734624; uint32_t buffer_offset
	}, ; 278: System.Runtime.CompilerServices.VisualC
	%struct.CompressedAssemblyDescriptor {
		i32 17744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48751856; uint32_t buffer_offset
	}, ; 279: System.Runtime.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48769600; uint32_t buffer_offset
	}, ; 280: System.Runtime.Handles
	%struct.CompressedAssemblyDescriptor {
		i32 38224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48785296; uint32_t buffer_offset
	}, ; 281: System.Runtime.InteropServices.JavaScript
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48823520; uint32_t buffer_offset
	}, ; 282: System.Runtime.InteropServices.RuntimeInformation
	%struct.CompressedAssemblyDescriptor {
		i32 64848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48838704; uint32_t buffer_offset
	}, ; 283: System.Runtime.InteropServices
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48903552; uint32_t buffer_offset
	}, ; 284: System.Runtime.Intrinsics
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48920784; uint32_t buffer_offset
	}, ; 285: System.Runtime.Loader
	%struct.CompressedAssemblyDescriptor {
		i32 145232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48936480; uint32_t buffer_offset
	}, ; 286: System.Runtime.Numerics
	%struct.CompressedAssemblyDescriptor {
		i32 65872, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49081712; uint32_t buffer_offset
	}, ; 287: System.Runtime.Serialization.Formatters
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49147584; uint32_t buffer_offset
	}, ; 288: System.Runtime.Serialization.Json
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49163280; uint32_t buffer_offset
	}, ; 289: System.Runtime.Serialization.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49186656; uint32_t buffer_offset
	}, ; 290: System.Runtime.Serialization.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49203376; uint32_t buffer_offset
	}, ; 291: System.Runtime.Serialization
	%struct.CompressedAssemblyDescriptor {
		i32 44880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49220608; uint32_t buffer_offset
	}, ; 292: System.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 58192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49265488; uint32_t buffer_offset
	}, ; 293: System.Security.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 55120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49323680; uint32_t buffer_offset
	}, ; 294: System.Security.Claims
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49378800; uint32_t buffer_offset
	}, ; 295: System.Security.Cryptography.Algorithms
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49396032; uint32_t buffer_offset
	}, ; 296: System.Security.Cryptography.Cng
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49412240; uint32_t buffer_offset
	}, ; 297: System.Security.Cryptography.Csp
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49428448; uint32_t buffer_offset
	}, ; 298: System.Security.Cryptography.Encoding
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49444144; uint32_t buffer_offset
	}, ; 299: System.Security.Cryptography.OpenSsl
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49459840; uint32_t buffer_offset
	}, ; 300: System.Security.Cryptography.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49475536; uint32_t buffer_offset
	}, ; 301: System.Security.Cryptography.X509Certificates
	%struct.CompressedAssemblyDescriptor {
		i32 852816, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49492256; uint32_t buffer_offset
	}, ; 302: System.Security.Cryptography
	%struct.CompressedAssemblyDescriptor {
		i32 37712, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50345072; uint32_t buffer_offset
	}, ; 303: System.Security.Principal.Windows
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50382784; uint32_t buffer_offset
	}, ; 304: System.Security.Principal
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50397968; uint32_t buffer_offset
	}, ; 305: System.Security.SecureString
	%struct.CompressedAssemblyDescriptor {
		i32 18256, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50413664; uint32_t buffer_offset
	}, ; 306: System.Security
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50431920; uint32_t buffer_offset
	}, ; 307: System.ServiceModel.Web
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50448640; uint32_t buffer_offset
	}, ; 308: System.ServiceProcess
	%struct.CompressedAssemblyDescriptor {
		i32 742736, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50464336; uint32_t buffer_offset
	}, ; 309: System.Text.Encoding.CodePages
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51207072; uint32_t buffer_offset
	}, ; 310: System.Text.Encoding.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51222768; uint32_t buffer_offset
	}, ; 311: System.Text.Encoding
	%struct.CompressedAssemblyDescriptor {
		i32 65872, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51238464; uint32_t buffer_offset
	}, ; 312: System.Text.Encodings.Web
	%struct.CompressedAssemblyDescriptor {
		i32 649040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51304336; uint32_t buffer_offset
	}, ; 313: System.Text.Json
	%struct.CompressedAssemblyDescriptor {
		i32 384848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51953376; uint32_t buffer_offset
	}, ; 314: System.Text.RegularExpressions
	%struct.CompressedAssemblyDescriptor {
		i32 33616, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52338224; uint32_t buffer_offset
	}, ; 315: System.Threading.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 66384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52371840; uint32_t buffer_offset
	}, ; 316: System.Threading.Channels
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52438224; uint32_t buffer_offset
	}, ; 317: System.Threading.Overlapped
	%struct.CompressedAssemblyDescriptor {
		i32 185680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52453920; uint32_t buffer_offset
	}, ; 318: System.Threading.Tasks.Dataflow
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52639600; uint32_t buffer_offset
	}, ; 319: System.Threading.Tasks.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 61264, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52655296; uint32_t buffer_offset
	}, ; 320: System.Threading.Tasks.Parallel
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52716560; uint32_t buffer_offset
	}, ; 321: System.Threading.Tasks
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52733280; uint32_t buffer_offset
	}, ; 322: System.Threading.Thread
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52748976; uint32_t buffer_offset
	}, ; 323: System.Threading.ThreadPool
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52764672; uint32_t buffer_offset
	}, ; 324: System.Threading.Timer
	%struct.CompressedAssemblyDescriptor {
		i32 44880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52779856; uint32_t buffer_offset
	}, ; 325: System.Threading
	%struct.CompressedAssemblyDescriptor {
		i32 175952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52824736; uint32_t buffer_offset
	}, ; 326: System.Transactions.Local
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53000688; uint32_t buffer_offset
	}, ; 327: System.Transactions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53017408; uint32_t buffer_offset
	}, ; 328: System.ValueTuple
	%struct.CompressedAssemblyDescriptor {
		i32 30032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53033104; uint32_t buffer_offset
	}, ; 329: System.Web.HttpUtility
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53063136; uint32_t buffer_offset
	}, ; 330: System.Web
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53078320; uint32_t buffer_offset
	}, ; 331: System.Windows
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53094016; uint32_t buffer_offset
	}, ; 332: System.Xml.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 21840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53109712; uint32_t buffer_offset
	}, ; 333: System.Xml.ReaderWriter
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53131552; uint32_t buffer_offset
	}, ; 334: System.Xml.Serialization
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53147760; uint32_t buffer_offset
	}, ; 335: System.Xml.XDocument
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53163456; uint32_t buffer_offset
	}, ; 336: System.Xml.XPath.XDocument
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53179152; uint32_t buffer_offset
	}, ; 337: System.Xml.XPath
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53194848; uint32_t buffer_offset
	}, ; 338: System.Xml.XmlDocument
	%struct.CompressedAssemblyDescriptor {
		i32 17744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53210544; uint32_t buffer_offset
	}, ; 339: System.Xml.XmlSerializer
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53228288; uint32_t buffer_offset
	}, ; 340: System.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 50512, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53251664; uint32_t buffer_offset
	}, ; 341: System
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53302176; uint32_t buffer_offset
	}, ; 342: WindowsBase
	%struct.CompressedAssemblyDescriptor {
		i32 59728, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53318384; uint32_t buffer_offset
	}, ; 343: mscorlib
	%struct.CompressedAssemblyDescriptor {
		i32 100688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53378112; uint32_t buffer_offset
	}, ; 344: netstandard
	%struct.CompressedAssemblyDescriptor {
		i32 244768, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53478800; uint32_t buffer_offset
	}, ; 345: Java.Interop
	%struct.CompressedAssemblyDescriptor {
		i32 83528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53723568; uint32_t buffer_offset
	}, ; 346: Mono.Android.Export
	%struct.CompressedAssemblyDescriptor {
		i32 22560, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53807096; uint32_t buffer_offset
	}, ; 347: Mono.Android.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 41570376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53829656; uint32_t buffer_offset
	}, ; 348: Mono.Android
	%struct.CompressedAssemblyDescriptor {
		i32 55840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 95400032; uint32_t buffer_offset
	}, ; 349: System.IO.Hashing
	%struct.CompressedAssemblyDescriptor {
		i32 5000016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 95455872; uint32_t buffer_offset
	} ; 350: System.Private.CoreLib
], align 4

@uncompressed_assemblies_data_size = dso_local local_unnamed_addr constant i32 100455888, align 4

@uncompressed_assemblies_data_buffer = dso_local local_unnamed_addr global [100455888 x i8] zeroinitializer, align 1

; Metadata
!llvm.module.flags = !{!0, !1, !7, !8, !9, !10}
!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!llvm.ident = !{!2}
!2 = !{!".NET for Android remotes/origin/darc-release/10.0.1xx-fce6efd9-cc42-423a-a4db-1a5ebe0f4ee4 @ 350a375fc202f0072ac4191624986d8c642b93fa"}
!3 = !{!4, !4, i64 0}
!4 = !{!"any pointer", !5, i64 0}
!5 = !{!"omnipotent char", !6, i64 0}
!6 = !{!"Simple C++ TBAA"}
!7 = !{i32 1, !"branch-target-enforcement", i32 0}
!8 = !{i32 1, !"sign-return-address", i32 0}
!9 = !{i32 1, !"sign-return-address-all", i32 0}
!10 = !{i32 1, !"sign-return-address-with-bkey", i32 0}
