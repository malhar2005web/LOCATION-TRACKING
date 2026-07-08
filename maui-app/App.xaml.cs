namespace LOCATION_TRACKING
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            AppDomain.CurrentDomain.UnhandledException += (sender, e) =>
            {
                LogUnhandledException(e.ExceptionObject as Exception);
            };

            TaskScheduler.UnobservedTaskException += (sender, e) =>
            {
                LogUnhandledException(e.Exception);
            };

#if ANDROID
            Android.Runtime.AndroidEnvironment.UnhandledExceptionRaiser += (sender, e) =>
            {
                LogUnhandledException(e.Exception);
            };
#endif
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            return new Window(new MainPage()) { Title = "LOCATION-TRACKING" };
        }

        private static void LogUnhandledException(Exception? ex)
        {
            if (ex == null) return;
            try
            {
                var path = Path.Combine(FileSystem.AppDataDirectory, "unhandled_errors.txt");
                File.WriteAllText(path, $"{DateTime.Now}: {ex.Message}\n\nStack Trace:\n{ex.StackTrace}\n\nInner Exception:\n{ex.InnerException}");
            }
            catch
            {
                // Ignore failures within exception logger
            }
        }
    }
}
