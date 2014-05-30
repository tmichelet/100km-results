
from collections import defaultdict
from statistics import mean, median

print("warning, this script is not optimized, and has been tested under 1GB of data")

logs = open('logs-snp.txt', 'r')

# results
malformed = 0
number_lines = 0
methods = defaultdict(int)
urls = defaultdict(int)
ips = defaultdict(int)
user_agents = defaultdict(int)
referers = defaultdict(int)

for line in logs:
    try:
        number_lines += 1
        (method, url, ip, user_agent, referer) = line.split(' # ')
        methods[method] += 1
        urls[url] += 1
        ips[ip] += 1
        user_agents[user_agent] += 1
        referers[referer] += 1
    except ValueError:
        malformed += 1
        continue



print("number of lines : %s" % number_lines)
print("malformed logs : %s" % malformed)

print("methods : %s" % [(k, v) for k, v in methods.items()])

print("distinct devices %s" % len(user_agents))
print("mean number of connections %s" % int(mean([v for v in user_agents.values()])))
print("median number of connections %s" % median([v for v in user_agents.values()]))
print()

print("distinct referers %s" % len(referers))
final_referers = [(c, r.replace('\n', '')) for r, c in referers.items()]
final_referers.sort()
print("top referers:")
for r, c in final_referers[::-1][:10]:
    print(r, c)


