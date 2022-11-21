from django.shortcuts import render
from .models import Game, Phone, Ranking
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse, Http404
import sqlite3
import json

# Create your views here.

def home(request):
    return render(request, 'Application/index.html', locals())

def test(request):
    return render(request, 'Application/2048.html', locals())

def list(request):
    return render(request, 'Application/list.html', locals())


def create(request):
    if request.method == "POST":
        nom = request.POST.get('nom').capitalize()
        prenom = request.POST.get('prenom').capitalize()
        mail = request.POST.get('mail').lower()
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        username = f"{nom}.{prenom}"

        if len(User.objects.filter(email=mail)) == 1:
            return HttpResponse("Vous avez déjà un compte")

        usr = User(username=username, password=password, email=mail, first_name=nom, last_name=prenom)
        usr.set_password(password)
        usr.save()

        usr_phone = Phone(username=usr, phone=phone)
        usr_phone.save()
        
        return HttpResponse(1)
    raise Http404("Chemin Non Trouvé")


def connect(request):
    if request.method == "POST":
        mail = request.POST.get("mail")
        password = request.POST.get("password")

        try:
            usr = User.objects.get(email=mail)
        except:
            return HttpResponse("Adresse Mail Incorrecte")
        
        if not usr.check_password(password):
            return HttpResponse("Mot de passe Incorecte")
        
        usr_phone = Phone.objects.get(username=usr)
        return HttpResponse(usr_phone.phone)
    
    raise Http404("Chemin non Trouvé")


def get_game(request):
    if request.method == "POST":
        game_list = []
        game = Game.objects.all()

        for g in game:
            game_list.append([
                g.id,
                g.titre,
                g.couverture,
                g.categorie,
                g.gameplay,
                g.prix
            ])

        return JsonResponse([game_list], safe=False)

    
    raise Http404("Chemin non Trouvé")

def get_ranking(request):
    if request.method == "POST":
        ranking_list = []
        ranking = Ranking.objects.all()
        #print(ranking[0])
        #print(type(ranking))
        for r in ranking:
            #print(r.user)
            user = str(r.user)
            ranking_list.append([
                r.titre,
                r.score,
                user
            ])
        ranking_list.sort(key=lambda x:x[1])
        return JsonResponse([ranking_list], safe=False)
    
def score(request):
    if request.method == "POST":
        
        score_list = []
        
        users = User.objects.all()
        mail = request.POST.get("user_mail")
        for u in users:
            if(u.email==mail):
                uid=u.id
                break
        score = Ranking.objects.filter(user=uid)
            
        print(score)
        if score.exists():
            score_list.append([score[0].score])
            ''' for s in score:
                score_user = s.user
                print(s.user)
                print(s.score)
                print(username)
                if(score_user==username):
                    print(s.user)
                    print(s.score)
                    score_list.append([
                        s.score
                    ])
                else: print(3333333333333) '''
            #print("score_list",end=' ')
            #print(score_list)
            print(score_list)
            return JsonResponse([score_list], safe=False)
        else:
            score_list.append([0,0,0])
            return JsonResponse([score_list], safe=False)
    raise Http404("Chemin non Trouvé")
    
def best_score(request):
    if request.method == "POST":
        #score = Ranking.objects.all()
        users = User.objects.all()
        mail = request.POST.get("user_mail")
        new_best_score = request.POST.get("score")
        title = request.POST.get("title")
        print()
        print(new_best_score)
        print()
        for u in users:
            if(u.email==mail):
                uid=u.id
                break
        score = Ranking.objects.filter(user=uid)
        #print(score.score)
        if score.exists():
            #score[0].score = new_best_score
            score.update(score=new_best_score)
            #score[0].save()
            print(1)
        else:
            print(2)
            score = Ranking()
            score.user_id = uid
            score.score = new_best_score
            score.titre = title
            score.save()
        return HttpResponse(1)
        #score = Ranking.objects.filter(username=uid).values()
        #return 0;
        #print(score.length)