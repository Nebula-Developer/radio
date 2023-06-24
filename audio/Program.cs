using ManagedBass;
using System.Runtime.InteropServices;
using System.Threading;
using System;

namespace Radio;

public static class Program {
    static int[] streamAudio = new int[2] { -1, -1 }; // Array to store stream handles
    static bool streamSwitch = false;
    static int audioFadeDuration = 5000;

    static int[] micAudio = new int[2] { -1, -1 };

    public static void SwapAudio(string path) {
        int streamFrom = streamSwitch ? 0 : 1;
        int streamTo = streamSwitch ? 1 : 0;

        // Create a new stream for the audio file
        streamAudio[streamTo] = Bass.CreateStream(path, Flags: BassFlags.Default);
        Bass.ChannelPlay(streamAudio[streamTo]);

        Bass.ChannelSetAttribute(streamAudio[streamTo], ChannelAttribute.Volume, 0);
        Bass.ChannelSlideAttribute(streamAudio[streamTo], ChannelAttribute.Volume, 1, audioFadeDuration);

        Bass.ChannelGetInfo(streamAudio[streamTo], out ChannelInfo info);
        int frequency = info.Frequency;

        if (streamFrom != -1) {
            // Special drown effect, won't probably be used, but it's cool:
            // Bass.ChannelSlideAttribute(streamAudio[streamFrom], ChannelAttribute.Frequency, 0, audioFadeDuration);
            Bass.ChannelSlideAttribute(streamAudio[streamFrom], ChannelAttribute.Volume, 0, audioFadeDuration);
            
            int lockStreamFrom = streamAudio[streamFrom];

            _ = Task.Run(async () => {
                await Task.Delay(audioFadeDuration);
                Bass.ChannelStop(lockStreamFrom);
                Bass.StreamFree(lockStreamFrom);
            });
        }

        streamSwitch = !streamSwitch;

        Console.WriteLine(streamSwitch.ToString() + ", " + streamFrom + ", " + streamTo);
    }

    public static float GetAudioLength(string path) {
        int stream = Bass.CreateStream(path, Flags: BassFlags.Default);
        Bass.ChannelGetInfo(stream, out ChannelInfo info);
        double length = Bass.ChannelBytes2Seconds(stream, Bass.ChannelGetLength(stream));
        Bass.StreamFree(stream);
        return (float)length;
    }
    
    public static void Main(string[] args) {
        if (!Bass.Init()) {
            Console.WriteLine("Bass failed to initialize!");
            return;
        }

        SwapAudio("samples/40oz.mp3");
        Task.Delay((int)(GetAudioLength("samples/40oz.mp3") * 1000) - audioFadeDuration).Wait();
        SwapAudio("samples/Playing-God.mp3");

        Console.ReadKey();
    }
}