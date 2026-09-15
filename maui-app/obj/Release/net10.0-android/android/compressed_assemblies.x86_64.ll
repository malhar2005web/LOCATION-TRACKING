; ModuleID = 'compressed_assemblies.x86_64.ll'
source_filename = "compressed_assemblies.x86_64.ll"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-android21"

%struct.CompressedAssemblyDescriptor = type {
	i32, ; uint32_t uncompressed_file_size
	i1, ; bool loaded
	i32 ; uint32_t buffer_offset
}

@compressed_assembly_count = dso_local local_unnamed_addr constant i32 351, align 4

@compressed_assembly_descriptors = dso_local local_unnamed_addr global [351 x %struct.CompressedAssemblyDescriptor] [
	%struct.CompressedAssemblyDescriptor {
		i32 380928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 0; uint32_t buffer_offset
	}, ; 0: LOCATION_TRACKING
	%struct.CompressedAssemblyDescriptor {
		i32 174128, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 380928; uint32_t buffer_offset
	}, ; 1: GoogleGson
	%struct.CompressedAssemblyDescriptor {
		i32 56120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 555056; uint32_t buffer_offset
	}, ; 2: Microsoft.AspNetCore.Authorization
	%struct.CompressedAssemblyDescriptor {
		i32 399632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 611176; uint32_t buffer_offset
	}, ; 3: Microsoft.AspNetCore.Components
	%struct.CompressedAssemblyDescriptor {
		i32 48392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1010808; uint32_t buffer_offset
	}, ; 4: Microsoft.AspNetCore.Components.Forms
	%struct.CompressedAssemblyDescriptor {
		i32 189744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1059200; uint32_t buffer_offset
	}, ; 5: Microsoft.AspNetCore.Components.Web
	%struct.CompressedAssemblyDescriptor {
		i32 114448, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1248944; uint32_t buffer_offset
	}, ; 6: Microsoft.AspNetCore.Components.WebView
	%struct.CompressedAssemblyDescriptor {
		i32 70456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1363392; uint32_t buffer_offset
	}, ; 7: Microsoft.AspNetCore.Components.WebView.Maui
	%struct.CompressedAssemblyDescriptor {
		i32 16696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1433848; uint32_t buffer_offset
	}, ; 8: Microsoft.AspNetCore.Metadata
	%struct.CompressedAssemblyDescriptor {
		i32 45320, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1450544; uint32_t buffer_offset
	}, ; 9: Microsoft.Extensions.Configuration
	%struct.CompressedAssemblyDescriptor {
		i32 28984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1495864; uint32_t buffer_offset
	}, ; 10: Microsoft.Extensions.Configuration.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 43792, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1524848; uint32_t buffer_offset
	}, ; 11: Microsoft.Extensions.Configuration.Binder
	%struct.CompressedAssemblyDescriptor {
		i32 28976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1568640; uint32_t buffer_offset
	}, ; 12: Microsoft.Extensions.Configuration.FileExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 28472, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1597616; uint32_t buffer_offset
	}, ; 13: Microsoft.Extensions.Configuration.Json
	%struct.CompressedAssemblyDescriptor {
		i32 96008, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1626088; uint32_t buffer_offset
	}, ; 14: Microsoft.Extensions.DependencyInjection
	%struct.CompressedAssemblyDescriptor {
		i32 66312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1722096; uint32_t buffer_offset
	}, ; 15: Microsoft.Extensions.DependencyInjection.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 36624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1788408; uint32_t buffer_offset
	}, ; 16: Microsoft.Extensions.Diagnostics
	%struct.CompressedAssemblyDescriptor {
		i32 31504, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1825032; uint32_t buffer_offset
	}, ; 17: Microsoft.Extensions.Diagnostics.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 23864, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1856536; uint32_t buffer_offset
	}, ; 18: Microsoft.Extensions.FileProviders.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 19208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1880400; uint32_t buffer_offset
	}, ; 19: Microsoft.Extensions.FileProviders.Composite
	%struct.CompressedAssemblyDescriptor {
		i32 34104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1899608; uint32_t buffer_offset
	}, ; 20: Microsoft.Extensions.FileProviders.Embedded
	%struct.CompressedAssemblyDescriptor {
		i32 45840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1933712; uint32_t buffer_offset
	}, ; 21: Microsoft.Extensions.FileProviders.Physical
	%struct.CompressedAssemblyDescriptor {
		i32 48400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 1979552; uint32_t buffer_offset
	}, ; 22: Microsoft.Extensions.FileSystemGlobbing
	%struct.CompressedAssemblyDescriptor {
		i32 54536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2027952; uint32_t buffer_offset
	}, ; 23: Microsoft.Extensions.Hosting.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 52016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2082488; uint32_t buffer_offset
	}, ; 24: Microsoft.Extensions.Logging
	%struct.CompressedAssemblyDescriptor {
		i32 67344, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2134504; uint32_t buffer_offset
	}, ; 25: Microsoft.Extensions.Logging.Abstractions
	%struct.CompressedAssemblyDescriptor {
		i32 20240, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2201848; uint32_t buffer_offset
	}, ; 26: Microsoft.Extensions.Logging.Debug
	%struct.CompressedAssemblyDescriptor {
		i32 65848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2222088; uint32_t buffer_offset
	}, ; 27: Microsoft.Extensions.Options
	%struct.CompressedAssemblyDescriptor {
		i32 22280, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2287936; uint32_t buffer_offset
	}, ; 28: Microsoft.Extensions.Options.ConfigurationExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 45328, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2310216; uint32_t buffer_offset
	}, ; 29: Microsoft.Extensions.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 43784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2355544; uint32_t buffer_offset
	}, ; 30: Microsoft.Extensions.Validation
	%struct.CompressedAssemblyDescriptor {
		i32 75528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2399328; uint32_t buffer_offset
	}, ; 31: Microsoft.JSInterop
	%struct.CompressedAssemblyDescriptor {
		i32 1928504, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 2474856; uint32_t buffer_offset
	}, ; 32: Microsoft.Maui.Controls
	%struct.CompressedAssemblyDescriptor {
		i32 135432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 4403360; uint32_t buffer_offset
	}, ; 33: Microsoft.Maui.Controls.Xaml
	%struct.CompressedAssemblyDescriptor {
		i32 875832, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 4538792; uint32_t buffer_offset
	}, ; 34: Microsoft.Maui
	%struct.CompressedAssemblyDescriptor {
		i32 280848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5414624; uint32_t buffer_offset
	}, ; 35: Microsoft.Maui.Essentials
	%struct.CompressedAssemblyDescriptor {
		i32 208696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5695472; uint32_t buffer_offset
	}, ; 36: Microsoft.Maui.Graphics
	%struct.CompressedAssemblyDescriptor {
		i32 74240, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5904168; uint32_t buffer_offset
	}, ; 37: Plugin.LocalNotification
	%struct.CompressedAssemblyDescriptor {
		i32 107520, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 5978408; uint32_t buffer_offset
	}, ; 38: SQLite-net
	%struct.CompressedAssemblyDescriptor {
		i32 5632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6085928; uint32_t buffer_offset
	}, ; 39: SQLitePCLRaw.batteries_v2
	%struct.CompressedAssemblyDescriptor {
		i32 50688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6091560; uint32_t buffer_offset
	}, ; 40: SQLitePCLRaw.core
	%struct.CompressedAssemblyDescriptor {
		i32 5632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6142248; uint32_t buffer_offset
	}, ; 41: SQLitePCLRaw.lib.e_sqlite3.android
	%struct.CompressedAssemblyDescriptor {
		i32 35840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6147880; uint32_t buffer_offset
	}, ; 42: SQLitePCLRaw.provider.e_sqlite3
	%struct.CompressedAssemblyDescriptor {
		i32 1194040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 6183720; uint32_t buffer_offset
	}, ; 43: Xamarin.Android.Glide
	%struct.CompressedAssemblyDescriptor {
		i32 15944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7377760; uint32_t buffer_offset
	}, ; 44: Xamarin.Android.Glide.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 25632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7393704; uint32_t buffer_offset
	}, ; 45: Xamarin.Android.Glide.DiskLruCache
	%struct.CompressedAssemblyDescriptor {
		i32 63032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7419336; uint32_t buffer_offset
	}, ; 46: Xamarin.Android.Glide.GifDecoder
	%struct.CompressedAssemblyDescriptor {
		i32 197688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7482368; uint32_t buffer_offset
	}, ; 47: Xamarin.AndroidX.Activity
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7680056; uint32_t buffer_offset
	}, ; 48: Xamarin.AndroidX.Activity.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 15912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7695984; uint32_t buffer_offset
	}, ; 49: Xamarin.AndroidX.Annotation
	%struct.CompressedAssemblyDescriptor {
		i32 38432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7711896; uint32_t buffer_offset
	}, ; 50: Xamarin.AndroidX.Annotation.Experimental
	%struct.CompressedAssemblyDescriptor {
		i32 215608, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7750328; uint32_t buffer_offset
	}, ; 51: Xamarin.AndroidX.Annotation.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 1305632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 7965936; uint32_t buffer_offset
	}, ; 52: Xamarin.AndroidX.AppCompat
	%struct.CompressedAssemblyDescriptor {
		i32 103456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9271568; uint32_t buffer_offset
	}, ; 53: Xamarin.AndroidX.AppCompat.AppCompatResources
	%struct.CompressedAssemblyDescriptor {
		i32 38984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9375024; uint32_t buffer_offset
	}, ; 54: Xamarin.AndroidX.Arch.Core.Common
	%struct.CompressedAssemblyDescriptor {
		i32 28192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9414008; uint32_t buffer_offset
	}, ; 55: Xamarin.AndroidX.Arch.Core.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 411184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9442200; uint32_t buffer_offset
	}, ; 56: Xamarin.AndroidX.Browser
	%struct.CompressedAssemblyDescriptor {
		i32 35400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9853384; uint32_t buffer_offset
	}, ; 57: Xamarin.AndroidX.CardView
	%struct.CompressedAssemblyDescriptor {
		i32 15944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9888784; uint32_t buffer_offset
	}, ; 58: Xamarin.AndroidX.Collection
	%struct.CompressedAssemblyDescriptor {
		i32 628768, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 9904728; uint32_t buffer_offset
	}, ; 59: Xamarin.AndroidX.Collection.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10533496; uint32_t buffer_offset
	}, ; 60: Xamarin.AndroidX.Collection.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 36424, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10549400; uint32_t buffer_offset
	}, ; 61: Xamarin.AndroidX.Concurrent.Futures
	%struct.CompressedAssemblyDescriptor {
		i32 752680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 10585824; uint32_t buffer_offset
	}, ; 62: Xamarin.AndroidX.ConstraintLayout
	%struct.CompressedAssemblyDescriptor {
		i32 1466936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 11338504; uint32_t buffer_offset
	}, ; 63: Xamarin.AndroidX.ConstraintLayout.Core
	%struct.CompressedAssemblyDescriptor {
		i32 112680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 12805440; uint32_t buffer_offset
	}, ; 64: Xamarin.AndroidX.CoordinatorLayout
	%struct.CompressedAssemblyDescriptor {
		i32 2221568, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 12918120; uint32_t buffer_offset
	}, ; 65: Xamarin.AndroidX.Core
	%struct.CompressedAssemblyDescriptor {
		i32 216608, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15139688; uint32_t buffer_offset
	}, ; 66: Xamarin.AndroidX.Core.Core.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 20016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15356296; uint32_t buffer_offset
	}, ; 67: Xamarin.AndroidX.Core.ViewTree
	%struct.CompressedAssemblyDescriptor {
		i32 64040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15376312; uint32_t buffer_offset
	}, ; 68: Xamarin.AndroidX.CursorAdapter
	%struct.CompressedAssemblyDescriptor {
		i32 74776, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15440352; uint32_t buffer_offset
	}, ; 69: Xamarin.AndroidX.CustomView
	%struct.CompressedAssemblyDescriptor {
		i32 25672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15515128; uint32_t buffer_offset
	}, ; 70: Xamarin.AndroidX.CustomView.PoolingContainer
	%struct.CompressedAssemblyDescriptor {
		i32 67632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15540800; uint32_t buffer_offset
	}, ; 71: Xamarin.AndroidX.DrawerLayout
	%struct.CompressedAssemblyDescriptor {
		i32 73272, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15608432; uint32_t buffer_offset
	}, ; 72: Xamarin.AndroidX.DynamicAnimation
	%struct.CompressedAssemblyDescriptor {
		i32 288816, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15681704; uint32_t buffer_offset
	}, ; 73: Xamarin.AndroidX.Emoji2
	%struct.CompressedAssemblyDescriptor {
		i32 26144, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15970520; uint32_t buffer_offset
	}, ; 74: Xamarin.AndroidX.Emoji2.ViewsHelper
	%struct.CompressedAssemblyDescriptor {
		i32 73288, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 15996664; uint32_t buffer_offset
	}, ; 75: Xamarin.AndroidX.ExifInterface
	%struct.CompressedAssemblyDescriptor {
		i32 384544, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16069952; uint32_t buffer_offset
	}, ; 76: Xamarin.AndroidX.Fragment
	%struct.CompressedAssemblyDescriptor {
		i32 27192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16454496; uint32_t buffer_offset
	}, ; 77: Xamarin.AndroidX.Fragment.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 26152, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16481688; uint32_t buffer_offset
	}, ; 78: Xamarin.AndroidX.Interpolator
	%struct.CompressedAssemblyDescriptor {
		i32 16952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16507840; uint32_t buffer_offset
	}, ; 79: Xamarin.AndroidX.Lifecycle.Common
	%struct.CompressedAssemblyDescriptor {
		i32 71200, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16524792; uint32_t buffer_offset
	}, ; 80: Xamarin.AndroidX.Lifecycle.Common.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 39464, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16595992; uint32_t buffer_offset
	}, ; 81: Xamarin.AndroidX.Lifecycle.LiveData
	%struct.CompressedAssemblyDescriptor {
		i32 36936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16635456; uint32_t buffer_offset
	}, ; 82: Xamarin.AndroidX.Lifecycle.LiveData.Core
	%struct.CompressedAssemblyDescriptor {
		i32 16440, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16672392; uint32_t buffer_offset
	}, ; 83: Xamarin.AndroidX.Lifecycle.LiveData.Core.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 22584, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16688832; uint32_t buffer_offset
	}, ; 84: Xamarin.AndroidX.Lifecycle.Process
	%struct.CompressedAssemblyDescriptor {
		i32 15416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16711416; uint32_t buffer_offset
	}, ; 85: Xamarin.AndroidX.Lifecycle.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 54312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16726832; uint32_t buffer_offset
	}, ; 86: Xamarin.AndroidX.Lifecycle.Runtime.Android
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16781144; uint32_t buffer_offset
	}, ; 87: Xamarin.AndroidX.Lifecycle.Runtime.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 16456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16797048; uint32_t buffer_offset
	}, ; 88: Xamarin.AndroidX.Lifecycle.Runtime.Ktx.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16813504; uint32_t buffer_offset
	}, ; 89: Xamarin.AndroidX.Lifecycle.ViewModel
	%struct.CompressedAssemblyDescriptor {
		i32 88632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16830432; uint32_t buffer_offset
	}, ; 90: Xamarin.AndroidX.Lifecycle.ViewModel.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16440, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16919064; uint32_t buffer_offset
	}, ; 91: Xamarin.AndroidX.Lifecycle.ViewModel.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16935504; uint32_t buffer_offset
	}, ; 92: Xamarin.AndroidX.Lifecycle.ViewModelSavedState
	%struct.CompressedAssemblyDescriptor {
		i32 48200, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16951432; uint32_t buffer_offset
	}, ; 93: Xamarin.AndroidX.Lifecycle.ViewModelSavedState.Android
	%struct.CompressedAssemblyDescriptor {
		i32 71720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 16999632; uint32_t buffer_offset
	}, ; 94: Xamarin.AndroidX.Loader
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17071352; uint32_t buffer_offset
	}, ; 95: Xamarin.AndroidX.Navigation.Common
	%struct.CompressedAssemblyDescriptor {
		i32 233016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17087256; uint32_t buffer_offset
	}, ; 96: Xamarin.AndroidX.Navigation.Common.Android
	%struct.CompressedAssemblyDescriptor {
		i32 60960, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17320272; uint32_t buffer_offset
	}, ; 97: Xamarin.AndroidX.Navigation.Fragment
	%struct.CompressedAssemblyDescriptor {
		i32 15928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17381232; uint32_t buffer_offset
	}, ; 98: Xamarin.AndroidX.Navigation.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 124984, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17397160; uint32_t buffer_offset
	}, ; 99: Xamarin.AndroidX.Navigation.Runtime.Android
	%struct.CompressedAssemblyDescriptor {
		i32 57400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17522144; uint32_t buffer_offset
	}, ; 100: Xamarin.AndroidX.Navigation.UI
	%struct.CompressedAssemblyDescriptor {
		i32 52784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17579544; uint32_t buffer_offset
	}, ; 101: Xamarin.AndroidX.ProfileInstaller.ProfileInstaller
	%struct.CompressedAssemblyDescriptor {
		i32 668712, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 17632328; uint32_t buffer_offset
	}, ; 102: Xamarin.AndroidX.RecyclerView
	%struct.CompressedAssemblyDescriptor {
		i32 30792, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18301040; uint32_t buffer_offset
	}, ; 103: Xamarin.AndroidX.ResourceInspection.Annotation
	%struct.CompressedAssemblyDescriptor {
		i32 15912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18331832; uint32_t buffer_offset
	}, ; 104: Xamarin.AndroidX.SavedState
	%struct.CompressedAssemblyDescriptor {
		i32 91688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18347744; uint32_t buffer_offset
	}, ; 105: Xamarin.AndroidX.SavedState.SavedState.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18439432; uint32_t buffer_offset
	}, ; 106: Xamarin.AndroidX.SavedState.SavedState.Ktx
	%struct.CompressedAssemblyDescriptor {
		i32 46648, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18455848; uint32_t buffer_offset
	}, ; 107: Xamarin.AndroidX.Security.SecurityCrypto
	%struct.CompressedAssemblyDescriptor {
		i32 50208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18502496; uint32_t buffer_offset
	}, ; 108: Xamarin.AndroidX.SlidingPaneLayout
	%struct.CompressedAssemblyDescriptor {
		i32 31304, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18552704; uint32_t buffer_offset
	}, ; 109: Xamarin.AndroidX.Startup.StartupRuntime
	%struct.CompressedAssemblyDescriptor {
		i32 77856, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18584008; uint32_t buffer_offset
	}, ; 110: Xamarin.AndroidX.SwipeRefreshLayout
	%struct.CompressedAssemblyDescriptor {
		i32 15392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18661864; uint32_t buffer_offset
	}, ; 111: Xamarin.AndroidX.Tracing.Tracing
	%struct.CompressedAssemblyDescriptor {
		i32 24104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18677256; uint32_t buffer_offset
	}, ; 112: Xamarin.AndroidX.Tracing.Tracing.Android
	%struct.CompressedAssemblyDescriptor {
		i32 185392, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18701360; uint32_t buffer_offset
	}, ; 113: Xamarin.AndroidX.Transition
	%struct.CompressedAssemblyDescriptor {
		i32 36384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18886752; uint32_t buffer_offset
	}, ; 114: Xamarin.AndroidX.VectorDrawable
	%struct.CompressedAssemblyDescriptor {
		i32 49184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18923136; uint32_t buffer_offset
	}, ; 115: Xamarin.AndroidX.VectorDrawable.Animated
	%struct.CompressedAssemblyDescriptor {
		i32 122936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 18972320; uint32_t buffer_offset
	}, ; 116: Xamarin.AndroidX.VersionedParcelable
	%struct.CompressedAssemblyDescriptor {
		i32 96288, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19095256; uint32_t buffer_offset
	}, ; 117: Xamarin.AndroidX.ViewPager
	%struct.CompressedAssemblyDescriptor {
		i32 74784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19191544; uint32_t buffer_offset
	}, ; 118: Xamarin.AndroidX.ViewPager2
	%struct.CompressedAssemblyDescriptor {
		i32 271904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19266328; uint32_t buffer_offset
	}, ; 119: Xamarin.AndroidX.Window
	%struct.CompressedAssemblyDescriptor {
		i32 15904, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19538232; uint32_t buffer_offset
	}, ; 120: Xamarin.AndroidX.Window.WindowCore
	%struct.CompressedAssemblyDescriptor {
		i32 35360, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19554136; uint32_t buffer_offset
	}, ; 121: Xamarin.AndroidX.Window.WindowCore.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 2789920, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 19589496; uint32_t buffer_offset
	}, ; 122: Xamarin.Google.Android.Material
	%struct.CompressedAssemblyDescriptor {
		i32 102432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 22379416; uint32_t buffer_offset
	}, ; 123: Jsr305Binding
	%struct.CompressedAssemblyDescriptor {
		i32 5886976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 22481848; uint32_t buffer_offset
	}, ; 124: Xamarin.Google.Crypto.Tink.Android
	%struct.CompressedAssemblyDescriptor {
		i32 101944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28368824; uint32_t buffer_offset
	}, ; 125: Xamarin.Google.ErrorProne.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 27192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28470768; uint32_t buffer_offset
	}, ; 126: Xamarin.Google.Guava.ListenableFuture
	%struct.CompressedAssemblyDescriptor {
		i32 738224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 28497960; uint32_t buffer_offset
	}, ; 127: Xamarin.GooglePlayServices.Base
	%struct.CompressedAssemblyDescriptor {
		i32 448032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29236184; uint32_t buffer_offset
	}, ; 128: Xamarin.GooglePlayServices.Basement
	%struct.CompressedAssemblyDescriptor {
		i32 247216, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29684216; uint32_t buffer_offset
	}, ; 129: Xamarin.GooglePlayServices.Location
	%struct.CompressedAssemblyDescriptor {
		i32 82464, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 29931432; uint32_t buffer_offset
	}, ; 130: Xamarin.GooglePlayServices.Tasks
	%struct.CompressedAssemblyDescriptor {
		i32 165944, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30013896; uint32_t buffer_offset
	}, ; 131: Xamarin.Jetbrains.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 28728, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30179840; uint32_t buffer_offset
	}, ; 132: Xamarin.JSpecify
	%struct.CompressedAssemblyDescriptor {
		i32 2375680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 30208568; uint32_t buffer_offset
	}, ; 133: Xamarin.Kotlin.StdLib
	%struct.CompressedAssemblyDescriptor {
		i32 27680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32584248; uint32_t buffer_offset
	}, ; 134: Xamarin.KotlinX.Coroutines.Android
	%struct.CompressedAssemblyDescriptor {
		i32 16432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32611928; uint32_t buffer_offset
	}, ; 135: Xamarin.KotlinX.Coroutines.Core
	%struct.CompressedAssemblyDescriptor {
		i32 568880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 32628360; uint32_t buffer_offset
	}, ; 136: Xamarin.KotlinX.Coroutines.Core.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 16416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33197240; uint32_t buffer_offset
	}, ; 137: Xamarin.KotlinX.Serialization.Core
	%struct.CompressedAssemblyDescriptor {
		i32 312376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33213656; uint32_t buffer_offset
	}, ; 138: Xamarin.KotlinX.Serialization.Core.Jvm
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33526032; uint32_t buffer_offset
	}, ; 139: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33541656; uint32_t buffer_offset
	}, ; 140: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33557288; uint32_t buffer_offset
	}, ; 141: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33572912; uint32_t buffer_offset
	}, ; 142: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33588536; uint32_t buffer_offset
	}, ; 143: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33604168; uint32_t buffer_offset
	}, ; 144: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33619800; uint32_t buffer_offset
	}, ; 145: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33635432; uint32_t buffer_offset
	}, ; 146: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33651056; uint32_t buffer_offset
	}, ; 147: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33666680; uint32_t buffer_offset
	}, ; 148: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33682312; uint32_t buffer_offset
	}, ; 149: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33697936; uint32_t buffer_offset
	}, ; 150: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33713560; uint32_t buffer_offset
	}, ; 151: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33729184; uint32_t buffer_offset
	}, ; 152: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33744808; uint32_t buffer_offset
	}, ; 153: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33760432; uint32_t buffer_offset
	}, ; 154: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33776056; uint32_t buffer_offset
	}, ; 155: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33791680; uint32_t buffer_offset
	}, ; 156: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33807304; uint32_t buffer_offset
	}, ; 157: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33822936; uint32_t buffer_offset
	}, ; 158: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33838600; uint32_t buffer_offset
	}, ; 159: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33854224; uint32_t buffer_offset
	}, ; 160: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33869856; uint32_t buffer_offset
	}, ; 161: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33885488; uint32_t buffer_offset
	}, ; 162: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33901120; uint32_t buffer_offset
	}, ; 163: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33916792; uint32_t buffer_offset
	}, ; 164: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33932424; uint32_t buffer_offset
	}, ; 165: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33948088; uint32_t buffer_offset
	}, ; 166: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33963712; uint32_t buffer_offset
	}, ; 167: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33979336; uint32_t buffer_offset
	}, ; 168: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 33994960; uint32_t buffer_offset
	}, ; 169: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15664, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34010584; uint32_t buffer_offset
	}, ; 170: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15624, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34026248; uint32_t buffer_offset
	}, ; 171: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 15632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34041872; uint32_t buffer_offset
	}, ; 172: Microsoft.Maui.Controls.resources
	%struct.CompressedAssemblyDescriptor {
		i32 726016, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34057504; uint32_t buffer_offset
	}, ; 173: _Microsoft.Android.Resource.Designer
	%struct.CompressedAssemblyDescriptor {
		i32 311632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 34783520; uint32_t buffer_offset
	}, ; 174: Microsoft.CSharp
	%struct.CompressedAssemblyDescriptor {
		i32 428880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35095152; uint32_t buffer_offset
	}, ; 175: Microsoft.VisualBasic.Core
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35524032; uint32_t buffer_offset
	}, ; 176: Microsoft.VisualBasic
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35541264; uint32_t buffer_offset
	}, ; 177: Microsoft.Win32.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 33104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35556960; uint32_t buffer_offset
	}, ; 178: Microsoft.Win32.Registry
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35590064; uint32_t buffer_offset
	}, ; 179: System.AppContext
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35605248; uint32_t buffer_offset
	}, ; 180: System.Buffers
	%struct.CompressedAssemblyDescriptor {
		i32 88912, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35620432; uint32_t buffer_offset
	}, ; 181: System.Collections.Concurrent
	%struct.CompressedAssemblyDescriptor {
		i32 251216, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35709344; uint32_t buffer_offset
	}, ; 182: System.Collections.Immutable
	%struct.CompressedAssemblyDescriptor {
		i32 47952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 35960560; uint32_t buffer_offset
	}, ; 183: System.Collections.NonGeneric
	%struct.CompressedAssemblyDescriptor {
		i32 47952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36008512; uint32_t buffer_offset
	}, ; 184: System.Collections.Specialized
	%struct.CompressedAssemblyDescriptor {
		i32 112976, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36056464; uint32_t buffer_offset
	}, ; 185: System.Collections
	%struct.CompressedAssemblyDescriptor {
		i32 102736, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36169440; uint32_t buffer_offset
	}, ; 186: System.ComponentModel.Annotations
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36272176; uint32_t buffer_offset
	}, ; 187: System.ComponentModel.DataAnnotations
	%struct.CompressedAssemblyDescriptor {
		i32 26448, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36288896; uint32_t buffer_offset
	}, ; 188: System.ComponentModel.EventBasedAsync
	%struct.CompressedAssemblyDescriptor {
		i32 42320, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36315344; uint32_t buffer_offset
	}, ; 189: System.ComponentModel.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 316752, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36357664; uint32_t buffer_offset
	}, ; 190: System.ComponentModel.TypeConverter
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36674416; uint32_t buffer_offset
	}, ; 191: System.ComponentModel
	%struct.CompressedAssemblyDescriptor {
		i32 19280, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36690624; uint32_t buffer_offset
	}, ; 192: System.Configuration
	%struct.CompressedAssemblyDescriptor {
		i32 50512, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36709904; uint32_t buffer_offset
	}, ; 193: System.Console
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36760416; uint32_t buffer_offset
	}, ; 194: System.Core
	%struct.CompressedAssemblyDescriptor {
		i32 1018192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 36783792; uint32_t buffer_offset
	}, ; 195: System.Data.Common
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37801984; uint32_t buffer_offset
	}, ; 196: System.Data.DataSetExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 25424, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37817680; uint32_t buffer_offset
	}, ; 197: System.Data
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37843104; uint32_t buffer_offset
	}, ; 198: System.Diagnostics.Contracts
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37859312; uint32_t buffer_offset
	}, ; 199: System.Diagnostics.Debug
	%struct.CompressedAssemblyDescriptor {
		i32 202576, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 37875008; uint32_t buffer_offset
	}, ; 200: System.Diagnostics.DiagnosticSource
	%struct.CompressedAssemblyDescriptor {
		i32 29520, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38077584; uint32_t buffer_offset
	}, ; 201: System.Diagnostics.FileVersionInfo
	%struct.CompressedAssemblyDescriptor {
		i32 128848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38107104; uint32_t buffer_offset
	}, ; 202: System.Diagnostics.Process
	%struct.CompressedAssemblyDescriptor {
		i32 25936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38235952; uint32_t buffer_offset
	}, ; 203: System.Diagnostics.StackTrace
	%struct.CompressedAssemblyDescriptor {
		i32 31568, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38261888; uint32_t buffer_offset
	}, ; 204: System.Diagnostics.TextWriterTraceListener
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38293456; uint32_t buffer_offset
	}, ; 205: System.Diagnostics.Tools
	%struct.CompressedAssemblyDescriptor {
		i32 58704, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38308640; uint32_t buffer_offset
	}, ; 206: System.Diagnostics.TraceSource
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38367344; uint32_t buffer_offset
	}, ; 207: System.Diagnostics.Tracing
	%struct.CompressedAssemblyDescriptor {
		i32 64848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38383552; uint32_t buffer_offset
	}, ; 208: System.Drawing.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 20304, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38448400; uint32_t buffer_offset
	}, ; 209: System.Drawing
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38468704; uint32_t buffer_offset
	}, ; 210: System.Dynamic.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 97104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38484912; uint32_t buffer_offset
	}, ; 211: System.Formats.Asn1
	%struct.CompressedAssemblyDescriptor {
		i32 121680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38582016; uint32_t buffer_offset
	}, ; 212: System.Formats.Tar
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38703696; uint32_t buffer_offset
	}, ; 213: System.Globalization.Calendars
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38719392; uint32_t buffer_offset
	}, ; 214: System.Globalization.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38734576; uint32_t buffer_offset
	}, ; 215: System.Globalization
	%struct.CompressedAssemblyDescriptor {
		i32 41296, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38750272; uint32_t buffer_offset
	}, ; 216: System.IO.Compression.Brotli
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38791568; uint32_t buffer_offset
	}, ; 217: System.IO.Compression.FileSystem
	%struct.CompressedAssemblyDescriptor {
		i32 53584, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38806752; uint32_t buffer_offset
	}, ; 218: System.IO.Compression.ZipFile
	%struct.CompressedAssemblyDescriptor {
		i32 167760, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 38860336; uint32_t buffer_offset
	}, ; 219: System.IO.Compression
	%struct.CompressedAssemblyDescriptor {
		i32 32080, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39028096; uint32_t buffer_offset
	}, ; 220: System.IO.FileSystem.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 51536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39060176; uint32_t buffer_offset
	}, ; 221: System.IO.FileSystem.DriveInfo
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39111712; uint32_t buffer_offset
	}, ; 222: System.IO.FileSystem.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 55120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39126896; uint32_t buffer_offset
	}, ; 223: System.IO.FileSystem.Watcher
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39182016; uint32_t buffer_offset
	}, ; 224: System.IO.FileSystem
	%struct.CompressedAssemblyDescriptor {
		i32 43344, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39197712; uint32_t buffer_offset
	}, ; 225: System.IO.IsolatedStorage
	%struct.CompressedAssemblyDescriptor {
		i32 50000, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39241056; uint32_t buffer_offset
	}, ; 226: System.IO.MemoryMappedFiles
	%struct.CompressedAssemblyDescriptor {
		i32 78160, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39291056; uint32_t buffer_offset
	}, ; 227: System.IO.Pipelines
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39369216; uint32_t buffer_offset
	}, ; 228: System.IO.Pipes.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 67408, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39392592; uint32_t buffer_offset
	}, ; 229: System.IO.Pipes
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39460000; uint32_t buffer_offset
	}, ; 230: System.IO.UnmanagedMemoryStream
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39475696; uint32_t buffer_offset
	}, ; 231: System.IO
	%struct.CompressedAssemblyDescriptor {
		i32 456528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39491392; uint32_t buffer_offset
	}, ; 232: System.Linq.AsyncEnumerable
	%struct.CompressedAssemblyDescriptor {
		i32 575312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 39947920; uint32_t buffer_offset
	}, ; 233: System.Linq.Expressions
	%struct.CompressedAssemblyDescriptor {
		i32 223056, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40523232; uint32_t buffer_offset
	}, ; 234: System.Linq.Parallel
	%struct.CompressedAssemblyDescriptor {
		i32 78672, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40746288; uint32_t buffer_offset
	}, ; 235: System.Linq.Queryable
	%struct.CompressedAssemblyDescriptor {
		i32 201040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 40824960; uint32_t buffer_offset
	}, ; 236: System.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 55632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41026000; uint32_t buffer_offset
	}, ; 237: System.Memory
	%struct.CompressedAssemblyDescriptor {
		i32 56144, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41081632; uint32_t buffer_offset
	}, ; 238: System.Net.Http.Json
	%struct.CompressedAssemblyDescriptor {
		i32 680272, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41137776; uint32_t buffer_offset
	}, ; 239: System.Net.Http
	%struct.CompressedAssemblyDescriptor {
		i32 132432, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41818048; uint32_t buffer_offset
	}, ; 240: System.Net.HttpListener
	%struct.CompressedAssemblyDescriptor {
		i32 174928, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 41950480; uint32_t buffer_offset
	}, ; 241: System.Net.Mail
	%struct.CompressedAssemblyDescriptor {
		i32 52560, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42125408; uint32_t buffer_offset
	}, ; 242: System.Net.NameResolution
	%struct.CompressedAssemblyDescriptor {
		i32 66384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42177968; uint32_t buffer_offset
	}, ; 243: System.Net.NetworkInformation
	%struct.CompressedAssemblyDescriptor {
		i32 55632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42244352; uint32_t buffer_offset
	}, ; 244: System.Net.Ping
	%struct.CompressedAssemblyDescriptor {
		i32 108880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42299984; uint32_t buffer_offset
	}, ; 245: System.Net.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 171856, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42408864; uint32_t buffer_offset
	}, ; 246: System.Net.Quic
	%struct.CompressedAssemblyDescriptor {
		i32 161616, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42580720; uint32_t buffer_offset
	}, ; 247: System.Net.Requests
	%struct.CompressedAssemblyDescriptor {
		i32 255312, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42742336; uint32_t buffer_offset
	}, ; 248: System.Net.Security
	%struct.CompressedAssemblyDescriptor {
		i32 40784, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 42997648; uint32_t buffer_offset
	}, ; 249: System.Net.ServerSentEvents
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43038432; uint32_t buffer_offset
	}, ; 250: System.Net.ServicePoint
	%struct.CompressedAssemblyDescriptor {
		i32 238416, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43053616; uint32_t buffer_offset
	}, ; 251: System.Net.Sockets
	%struct.CompressedAssemblyDescriptor {
		i32 70480, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43292032; uint32_t buffer_offset
	}, ; 252: System.Net.WebClient
	%struct.CompressedAssemblyDescriptor {
		i32 33104, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43362512; uint32_t buffer_offset
	}, ; 253: System.Net.WebHeaderCollection
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43395616; uint32_t buffer_offset
	}, ; 254: System.Net.WebProxy
	%struct.CompressedAssemblyDescriptor {
		i32 51536, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43418992; uint32_t buffer_offset
	}, ; 255: System.Net.WebSockets.Client
	%struct.CompressedAssemblyDescriptor {
		i32 108880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43470528; uint32_t buffer_offset
	}, ; 256: System.Net.WebSockets
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43579408; uint32_t buffer_offset
	}, ; 257: System.Net
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43596640; uint32_t buffer_offset
	}, ; 258: System.Numerics.Vectors
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43612336; uint32_t buffer_offset
	}, ; 259: System.Numerics
	%struct.CompressedAssemblyDescriptor {
		i32 41296, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43627520; uint32_t buffer_offset
	}, ; 260: System.ObjectModel
	%struct.CompressedAssemblyDescriptor {
		i32 859472, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 43668816; uint32_t buffer_offset
	}, ; 261: System.Private.DataContractSerialization
	%struct.CompressedAssemblyDescriptor {
		i32 105808, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44528288; uint32_t buffer_offset
	}, ; 262: System.Private.Uri
	%struct.CompressedAssemblyDescriptor {
		i32 153936, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44634096; uint32_t buffer_offset
	}, ; 263: System.Private.Xml.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 3106128, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 44788032; uint32_t buffer_offset
	}, ; 264: System.Private.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 38224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47894160; uint32_t buffer_offset
	}, ; 265: System.Reflection.DispatchProxy
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47932384; uint32_t buffer_offset
	}, ; 266: System.Reflection.Emit.ILGeneration
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47948080; uint32_t buffer_offset
	}, ; 267: System.Reflection.Emit.Lightweight
	%struct.CompressedAssemblyDescriptor {
		i32 133456, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 47963776; uint32_t buffer_offset
	}, ; 268: System.Reflection.Emit
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48097232; uint32_t buffer_offset
	}, ; 269: System.Reflection.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 503632, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48112416; uint32_t buffer_offset
	}, ; 270: System.Reflection.Metadata
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48616048; uint32_t buffer_offset
	}, ; 271: System.Reflection.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 24400, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48631744; uint32_t buffer_offset
	}, ; 272: System.Reflection.TypeExtensions
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48656144; uint32_t buffer_offset
	}, ; 273: System.Reflection
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48672352; uint32_t buffer_offset
	}, ; 274: System.Resources.Reader
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48687536; uint32_t buffer_offset
	}, ; 275: System.Resources.ResourceManager
	%struct.CompressedAssemblyDescriptor {
		i32 26960, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48703232; uint32_t buffer_offset
	}, ; 276: System.Resources.Writer
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48730192; uint32_t buffer_offset
	}, ; 277: System.Runtime.CompilerServices.Unsafe
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48745376; uint32_t buffer_offset
	}, ; 278: System.Runtime.CompilerServices.VisualC
	%struct.CompressedAssemblyDescriptor {
		i32 17744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48762608; uint32_t buffer_offset
	}, ; 279: System.Runtime.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48780352; uint32_t buffer_offset
	}, ; 280: System.Runtime.Handles
	%struct.CompressedAssemblyDescriptor {
		i32 38224, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48796048; uint32_t buffer_offset
	}, ; 281: System.Runtime.InteropServices.JavaScript
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48834272; uint32_t buffer_offset
	}, ; 282: System.Runtime.InteropServices.RuntimeInformation
	%struct.CompressedAssemblyDescriptor {
		i32 64848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48849456; uint32_t buffer_offset
	}, ; 283: System.Runtime.InteropServices
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48914304; uint32_t buffer_offset
	}, ; 284: System.Runtime.Intrinsics
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48931536; uint32_t buffer_offset
	}, ; 285: System.Runtime.Loader
	%struct.CompressedAssemblyDescriptor {
		i32 145232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 48947232; uint32_t buffer_offset
	}, ; 286: System.Runtime.Numerics
	%struct.CompressedAssemblyDescriptor {
		i32 65872, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49092464; uint32_t buffer_offset
	}, ; 287: System.Runtime.Serialization.Formatters
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49158336; uint32_t buffer_offset
	}, ; 288: System.Runtime.Serialization.Json
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49174032; uint32_t buffer_offset
	}, ; 289: System.Runtime.Serialization.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49197408; uint32_t buffer_offset
	}, ; 290: System.Runtime.Serialization.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49214128; uint32_t buffer_offset
	}, ; 291: System.Runtime.Serialization
	%struct.CompressedAssemblyDescriptor {
		i32 44880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49231360; uint32_t buffer_offset
	}, ; 292: System.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 58192, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49276240; uint32_t buffer_offset
	}, ; 293: System.Security.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 55120, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49334432; uint32_t buffer_offset
	}, ; 294: System.Security.Claims
	%struct.CompressedAssemblyDescriptor {
		i32 17232, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49389552; uint32_t buffer_offset
	}, ; 295: System.Security.Cryptography.Algorithms
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49406784; uint32_t buffer_offset
	}, ; 296: System.Security.Cryptography.Cng
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49422992; uint32_t buffer_offset
	}, ; 297: System.Security.Cryptography.Csp
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49439200; uint32_t buffer_offset
	}, ; 298: System.Security.Cryptography.Encoding
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49454896; uint32_t buffer_offset
	}, ; 299: System.Security.Cryptography.OpenSsl
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49470592; uint32_t buffer_offset
	}, ; 300: System.Security.Cryptography.Primitives
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49486288; uint32_t buffer_offset
	}, ; 301: System.Security.Cryptography.X509Certificates
	%struct.CompressedAssemblyDescriptor {
		i32 852816, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 49503008; uint32_t buffer_offset
	}, ; 302: System.Security.Cryptography
	%struct.CompressedAssemblyDescriptor {
		i32 37712, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50355824; uint32_t buffer_offset
	}, ; 303: System.Security.Principal.Windows
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50393536; uint32_t buffer_offset
	}, ; 304: System.Security.Principal
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50408720; uint32_t buffer_offset
	}, ; 305: System.Security.SecureString
	%struct.CompressedAssemblyDescriptor {
		i32 18256, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50424416; uint32_t buffer_offset
	}, ; 306: System.Security
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50442672; uint32_t buffer_offset
	}, ; 307: System.ServiceModel.Web
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50459392; uint32_t buffer_offset
	}, ; 308: System.ServiceProcess
	%struct.CompressedAssemblyDescriptor {
		i32 742736, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 50475088; uint32_t buffer_offset
	}, ; 309: System.Text.Encoding.CodePages
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51217824; uint32_t buffer_offset
	}, ; 310: System.Text.Encoding.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51233520; uint32_t buffer_offset
	}, ; 311: System.Text.Encoding
	%struct.CompressedAssemblyDescriptor {
		i32 65872, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51249216; uint32_t buffer_offset
	}, ; 312: System.Text.Encodings.Web
	%struct.CompressedAssemblyDescriptor {
		i32 649040, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51315088; uint32_t buffer_offset
	}, ; 313: System.Text.Json
	%struct.CompressedAssemblyDescriptor {
		i32 384848, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 51964128; uint32_t buffer_offset
	}, ; 314: System.Text.RegularExpressions
	%struct.CompressedAssemblyDescriptor {
		i32 33616, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52348976; uint32_t buffer_offset
	}, ; 315: System.Threading.AccessControl
	%struct.CompressedAssemblyDescriptor {
		i32 66384, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52382592; uint32_t buffer_offset
	}, ; 316: System.Threading.Channels
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52448976; uint32_t buffer_offset
	}, ; 317: System.Threading.Overlapped
	%struct.CompressedAssemblyDescriptor {
		i32 185680, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52464672; uint32_t buffer_offset
	}, ; 318: System.Threading.Tasks.Dataflow
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52650352; uint32_t buffer_offset
	}, ; 319: System.Threading.Tasks.Extensions
	%struct.CompressedAssemblyDescriptor {
		i32 61264, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52666048; uint32_t buffer_offset
	}, ; 320: System.Threading.Tasks.Parallel
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52727312; uint32_t buffer_offset
	}, ; 321: System.Threading.Tasks
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52744032; uint32_t buffer_offset
	}, ; 322: System.Threading.Thread
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52759728; uint32_t buffer_offset
	}, ; 323: System.Threading.ThreadPool
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52775424; uint32_t buffer_offset
	}, ; 324: System.Threading.Timer
	%struct.CompressedAssemblyDescriptor {
		i32 44880, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52790608; uint32_t buffer_offset
	}, ; 325: System.Threading
	%struct.CompressedAssemblyDescriptor {
		i32 175952, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 52835488; uint32_t buffer_offset
	}, ; 326: System.Transactions.Local
	%struct.CompressedAssemblyDescriptor {
		i32 16720, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53011440; uint32_t buffer_offset
	}, ; 327: System.Transactions
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53028160; uint32_t buffer_offset
	}, ; 328: System.ValueTuple
	%struct.CompressedAssemblyDescriptor {
		i32 30032, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53043856; uint32_t buffer_offset
	}, ; 329: System.Web.HttpUtility
	%struct.CompressedAssemblyDescriptor {
		i32 15184, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53073888; uint32_t buffer_offset
	}, ; 330: System.Web
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53089072; uint32_t buffer_offset
	}, ; 331: System.Windows
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53104768; uint32_t buffer_offset
	}, ; 332: System.Xml.Linq
	%struct.CompressedAssemblyDescriptor {
		i32 21840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53120464; uint32_t buffer_offset
	}, ; 333: System.Xml.ReaderWriter
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53142304; uint32_t buffer_offset
	}, ; 334: System.Xml.Serialization
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53158512; uint32_t buffer_offset
	}, ; 335: System.Xml.XDocument
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53174208; uint32_t buffer_offset
	}, ; 336: System.Xml.XPath.XDocument
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53189904; uint32_t buffer_offset
	}, ; 337: System.Xml.XPath
	%struct.CompressedAssemblyDescriptor {
		i32 15696, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53205600; uint32_t buffer_offset
	}, ; 338: System.Xml.XmlDocument
	%struct.CompressedAssemblyDescriptor {
		i32 17744, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53221296; uint32_t buffer_offset
	}, ; 339: System.Xml.XmlSerializer
	%struct.CompressedAssemblyDescriptor {
		i32 23376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53239040; uint32_t buffer_offset
	}, ; 340: System.Xml
	%struct.CompressedAssemblyDescriptor {
		i32 50512, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53262416; uint32_t buffer_offset
	}, ; 341: System
	%struct.CompressedAssemblyDescriptor {
		i32 16208, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53312928; uint32_t buffer_offset
	}, ; 342: WindowsBase
	%struct.CompressedAssemblyDescriptor {
		i32 59728, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53329136; uint32_t buffer_offset
	}, ; 343: mscorlib
	%struct.CompressedAssemblyDescriptor {
		i32 100688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53388864; uint32_t buffer_offset
	}, ; 344: netstandard
	%struct.CompressedAssemblyDescriptor {
		i32 244768, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53489552; uint32_t buffer_offset
	}, ; 345: Java.Interop
	%struct.CompressedAssemblyDescriptor {
		i32 83528, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53734320; uint32_t buffer_offset
	}, ; 346: Mono.Android.Export
	%struct.CompressedAssemblyDescriptor {
		i32 22560, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53817848; uint32_t buffer_offset
	}, ; 347: Mono.Android.Runtime
	%struct.CompressedAssemblyDescriptor {
		i32 41570376, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 53840408; uint32_t buffer_offset
	}, ; 348: Mono.Android
	%struct.CompressedAssemblyDescriptor {
		i32 55840, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 95410784; uint32_t buffer_offset
	}, ; 349: System.IO.Hashing
	%struct.CompressedAssemblyDescriptor {
		i32 4964688, ; uint32_t uncompressed_file_size
		i1 false, ; bool loaded
		i32 95466624; uint32_t buffer_offset
	} ; 350: System.Private.CoreLib
], align 16

@uncompressed_assemblies_data_size = dso_local local_unnamed_addr constant i32 100431312, align 4

@uncompressed_assemblies_data_buffer = dso_local local_unnamed_addr global [100431312 x i8] zeroinitializer, align 16

; Metadata
!llvm.module.flags = !{!0, !1}
!0 = !{i32 1, !"wchar_size", i32 4}
!1 = !{i32 7, !"PIC Level", i32 2}
!llvm.ident = !{!2}
!2 = !{!".NET for Android remotes/origin/darc-release/10.0.1xx-fce6efd9-cc42-423a-a4db-1a5ebe0f4ee4 @ 350a375fc202f0072ac4191624986d8c642b93fa"}
!3 = !{!4, !4, i64 0}
!4 = !{!"any pointer", !5, i64 0}
!5 = !{!"omnipotent char", !6, i64 0}
!6 = !{!"Simple C++ TBAA"}
