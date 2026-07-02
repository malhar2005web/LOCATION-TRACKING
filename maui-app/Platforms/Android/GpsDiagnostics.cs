#if ANDROID
using System;
using System.IO;
using Microsoft.Maui.Storage;

namespace LocationTracker.Platforms.Android
{
    public static class GpsDiagnostics
    {
        private static readonly string LogPath = Path.Combine(FileSystem.Current.CacheDirectory, "gps_diagnostics.txt");
        private static readonly object LockObj = new object();

        public static void Log(string message)
        {
            try
            {
                lock (LockObj)
                {
                    var logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}{Environment.NewLine}";
                    File.AppendAllText(LogPath, logMessage);
                    System.Diagnostics.Debug.WriteLine(logMessage);
                }
            }
            catch { }
        }

        public static string ReadLogs()
        {
            try
            {
                lock (LockObj)
                {
                    if (File.Exists(LogPath))
                    {
                        return File.ReadAllText(LogPath);
                    }
                }
            }
            catch { }
            return "No diagnostics logs found.";
        }

        public static void ClearLogs()
        {
            try
            {
                lock (LockObj)
                {
                    if (File.Exists(LogPath))
                    {
                        File.Delete(LogPath);
                    }
                }
            }
            catch { }
        }
    }
}
#endif
