using Microsoft.UI.Xaml;

namespace LOCATION_TRACKING.WinUI
{

    public partial class App : MauiWinUIApplication
    {

        public App()
        {
            this.InitializeComponent();
        }

        protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
    }

}
