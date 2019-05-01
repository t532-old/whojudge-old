from psutil import Process

while True:
    pid = int(input())
    try:
        process = Process(pid)
        print(process.memory_info().rss)
    except:
        print(0)
