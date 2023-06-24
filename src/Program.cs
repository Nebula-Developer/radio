using ManagedBass;

namespace Radio;

public static class Program {
    static int[] streamAudio = new int[2] { -1, -1 }; // Array to store stream handles
    static bool streamSwitch = false;
    static int audioFadeDuration = 3000;

    public static void SwapAudio(string path) {
        int streamFrom = streamSwitch ? 0 : 1;
        int streamTo = streamSwitch ? 1 : 0;

        // Create a new stream for the audio file
        streamAudio[streamTo] = Bass.CreateStream(path, Flags: BassFlags.Default);
        Bass.ChannelPlay(streamAudio[streamTo]);

        Bass.ChannelSetAttribute(streamAudio[streamTo], ChannelAttribute.Volume, 0);
        Bass.ChannelSlideAttribute(streamAudio[streamTo], ChannelAttribute.Volume, 1, audioFadeDuration);

        if (streamFrom != -1) {
            Bass.ChannelSlideAttribute(streamAudio[streamFrom], ChannelAttribute.Volume, 0, audioFadeDuration);
            
            Task.Run(async () => {
                await Task.Delay(audioFadeDuration);
                Bass.ChannelStop(streamAudio[streamFrom]);
                Bass.StreamFree(streamAudio[streamFrom]);
            });
        }

        streamSwitch = !streamSwitch;

        Console.WriteLine(streamSwitch.ToString() + ", " + streamFrom + ", " + streamTo);
    }

    public static void Main(string[] args) {
        string pathA = "samples/40oz.mp3",
               pathB = "samples/Playing-God.mp3";

        if (!Bass.Init()) {
            Console.WriteLine("Failed to initialize BASS");
            return;
        }

        SwapAudio(pathA);

        Thread.Sleep(3000);

        SwapAudio(pathB);

        Thread.Sleep(3000);

        Console.WriteLine("Press any key to exit");
        Console.ReadKey(true);
        Bass.Free();
    }
}
