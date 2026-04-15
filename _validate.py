# -*- coding: utf-8 -*-
import json

with open('public/question-packs/kafka/kafka-connect-mysql-cdc.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

q = data['questions'][0]

# Check for bad Chinese quotes (should use 「」 not "")
bad = 0
for field in ['content', 'answer']:
    for ch in ['\u201c', '\u201d', '\u2018', '\u2019']:
        c = q[field].count(ch)
        if c > 0:
            bad += c
            print(f'BAD QUOTE: {c} occurrences in {field}')

for qz in q['quiz']:
    for ch in ['\u201c', '\u201d', '\u2018', '\u2019']:
        c = qz['explanation'].count(ch) + qz['question'].count(ch)
        if c > 0:
            bad += c
            print(f'BAD QUOTE in quiz: {c} occurrences')

print(f'Bad quotes total: {bad}')

# Validate quiz structure
print('\n--- Quiz Validation ---')
for i, qz in enumerate(q['quiz']):
    assert len(qz['choices']) == 4, f'Quiz {i+1}: expected 4 choices'
    assert qz['correctAnswer'] in ['A', 'B', 'C', 'D'], f'Quiz {i+1}: bad answer'
    el = len(qz['explanation'])
    print(f'  Q{i+1}: answer={qz["correctAnswer"]} explanation={el} chars')

# Validate keypoints
print('\n--- KeyPoints Validation ---')
for i, kp in enumerate(q['keyPoints']):
    print(f'  KP{i+1}: {len(kp)} chars')

# Check 「」 usage
good_quotes = 0
for field in ['content', 'answer']:
    good_quotes += q[field].count('\u300c') + q[field].count('\u300d')
print(f'\nGood quotes (「」) found: {good_quotes}')

# Check no bullet lists in answer
bullet_count = 0
for line in q['answer'].split('\n'):
    stripped = line.strip()
    if stripped.startswith('- ') or stripped.startswith('* '):
        if not stripped.startswith('- **') and '```' not in stripped:
            bullet_count += 1
            print(f'WARNING bullet: {stripped[:60]}')
print(f'Bullet lines: {bullet_count}')

print('\n=== ALL VALIDATIONS PASSED ===')
